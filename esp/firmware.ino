#include <lvgl.h>
#include <TFT_eSPI.h>
#include <XPT2046_Touchscreen.h>
#include <EEPROM.h>
#include "esp_timer.h"

// ================== Hardware & Screen ==================
#define XPT2046_IRQ   36
#define XPT2046_MOSI  32
#define XPT2046_MISO  39
#define XPT2046_CLK   25
#define XPT2046_CS    33

// Portrait 240x320 (as per your latest setup)
#define SCREEN_WIDTH  240
#define SCREEN_HEIGHT 320
#define EEPROM_SIZE   64



SPIClass touchscreenSPI = SPIClass(VSPI);
XPT2046_Touchscreen touchscreen(XPT2046_CS, XPT2046_IRQ);
TFT_eSPI tft = TFT_eSPI();

// ================== LVGL Buffer ==================
static uint32_t draw_buf[SCREEN_WIDTH * SCREEN_HEIGHT / 10];

// ================== Channels ==================
const int NUM_CHANNELS = 8;
const int outputPins[NUM_CHANNELS] = {2, 4, 16, 17, 5, 18, 19, 23};
bool chState[NUM_CHANNELS] = {0};
int seq[NUM_CHANNELS] = {0,1,2,3,4,5,6,7};

// ================== Settings (EEPROM) ==================
int pulseSeconds = 5;   // 1..60
int restSeconds  = 2;   // 0..15

// ================== Runtime/Mode ==================
enum ActiveMode { MODE_NONE, MODE_AUTO, MODE_MANUAL, MODE_CUSTOM };
ActiveMode mode = MODE_NONE;

bool engineOn = false;       // for AUTO/CUSTOM engines
bool inPulse  = false;
int  stepIdx  = 0;
unsigned long stateStart = 0;

// ================== Colors (Blue/Black) ==================
#define COL_BG      0x0861   // #0B0F14-ish
#define COL_CARD    0x10A2
#define COL_TEXT    0xFFFF   // white
#define COL_ACCENT  0x1D9A   // blue
#define COL_MUTED   0x5ACB
#define COL_OK      0x0605   // green
#define COL_WARN    0xFBE0   // yellow
#define COL_ERR     0xE8E4   // red

// ================== LVGL Objects ==================
lv_obj_t *tabview;

lv_obj_t *arcPulse, *arcRest;            // SETTINGS
lv_obj_t *lblAutoStatus, *btnAutoStart, *btnAutoReset;   // AUTO
lv_obj_t *manualBtns[NUM_CHANNELS], *lblManualStatus;     // MANUAL
lv_obj_t *seqLbl[NUM_CHANNELS], *btnCustomStart, *lblCustomStatus; // CUSTOM

// ================== TICK ==================
void lv_tick_task(void *a){ LV_UNUSED(a); lv_tick_inc(1); }
esp_timer_handle_t tick;
void setup_tick(){
  const esp_timer_create_args_t args = {.callback=&lv_tick_task,.name="lvgl"};
  esp_timer_create(&args, &tick);
  esp_timer_start_periodic(tick, 1000);
}

// ================== EEPROM ==================
void saveCfg(){
  EEPROM.writeInt(0, pulseSeconds);
  EEPROM.writeInt(4, restSeconds);
  for(int i=0;i<NUM_CHANNELS;i++) EEPROM.writeByte(8+i, seq[i]);
  EEPROM.commit();
}
void loadCfg(){
  EEPROM.begin(EEPROM_SIZE);
  int ps = EEPROM.readInt(0);
  int rs = EEPROM.readInt(4);
  if (ps >= 1 && ps <= 60) pulseSeconds = ps;
  if (rs >= 0 && rs <= 15) restSeconds  = rs;
  for(int i=0;i<NUM_CHANNELS;i++){
    int v = EEPROM.readByte(8+i);
    if (v>=0 && v<NUM_CHANNELS) seq[i] = v;
  }
}

// ================== IO Helpers ==================
void allOff(){
  for(int i=0;i<NUM_CHANNELS;i++){
    digitalWrite(outputPins[i], LOW);
    chState[i] = false;
  }
}
void setOnly(int ch){ // ensure single active channel
  for(int i=0;i<NUM_CHANNELS;i++){
    bool on = (i==ch);
    digitalWrite(outputPins[i], on ? HIGH : LOW);
    chState[i] = on;
  }
}
void noneOn(){ allOff(); }

// ================== Touch ==================
static inline int clampi(int v, int lo, int hi){ if(v<lo) return lo; if(v>hi) return hi; return v; }

void touchscreen_read(lv_indev_t*,lv_indev_data_t*d){
  if(touchscreen.touched()){
    TS_Point p=touchscreen.getPoint();
    int x=map(p.x,200,3700,0,SCREEN_WIDTH);
    int y=map(p.y,240,3800,0,SCREEN_HEIGHT);
    d->state=LV_INDEV_STATE_PRESSED;d->point.x=x;d->point.y=y;
  }else d->state=LV_INDEV_STATE_RELEASED;
}


// ================== Mode Control ==================
void setMode(ActiveMode m){
  if (mode == m) return;
  // Stop everything when switching
  engineOn = false;
  inPulse  = false;
  stepIdx  = 0;
  stateStart = millis();
  noneOn();
  mode = m;
}

// ================== SETTINGS (page 1) ==================
void arc_event_cb(lv_event_t* e){
  lv_obj_t *arc = lv_event_get_target_obj(e);
  int val = lv_arc_get_value(arc);
  if (arc == arcPulse) {
    pulseSeconds = val;
  } else if (arc == arcRest) {
    restSeconds = val;
  }
  saveCfg();
}

void build_settings_tab(lv_obj_t *tab){
  lv_obj_set_style_bg_color(tab, lv_color_hex(0x0B0F14), 0);
  lv_obj_set_style_text_color(tab, lv_color_white(), 0);

  lv_obj_t *title = lv_label_create(tab);
  lv_label_set_text(title, "SETTINGS");
  lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 6);

  // Pulse arc (top)
  arcPulse = lv_arc_create(tab);
  lv_arc_set_range(arcPulse, 1, 60);
  lv_arc_set_value(arcPulse, pulseSeconds);
  lv_obj_set_size(arcPulse, 120, 120);
  lv_obj_align(arcPulse, LV_ALIGN_TOP_MID, 0, 30);
  lv_obj_add_event_cb(arcPulse, arc_event_cb, LV_EVENT_VALUE_CHANGED, NULL);

  lv_obj_t *lp = lv_label_create(tab);
  lv_label_set_text(lp, "Pulse (s)");
  lv_obj_align_to(lp, arcPulse, LV_ALIGN_OUT_BOTTOM_MID, 0, 6);

  // Rest arc (bottom)
  arcRest = lv_arc_create(tab);
  lv_arc_set_range(arcRest, 0, 15);
  lv_arc_set_value(arcRest, restSeconds);
  lv_obj_set_size(arcRest, 120, 120);
  lv_obj_align(arcRest, LV_ALIGN_BOTTOM_MID, 0, -60);
  lv_obj_add_event_cb(arcRest, arc_event_cb, LV_EVENT_VALUE_CHANGED, NULL);

  lv_obj_t *lr = lv_label_create(tab);
  lv_label_set_text(lr, "Rest (s)");
  lv_obj_align_to(lr, arcRest, LV_ALIGN_OUT_BOTTOM_MID, 0, 6);
}

// ================== AUTO (page 2) ==================
void auto_start_stop_cb(lv_event_t* e){
  if (lv_event_get_code(e) != LV_EVENT_CLICKED) return;
  if (!engineOn) setMode(MODE_AUTO);
  engineOn = !engineOn;
  inPulse = false;
  stepIdx = 0;
  stateStart = millis();
  noneOn();
  lv_label_set_text(lv_obj_get_child(btnAutoStart, 0), engineOn ? "STOP" : "START");
}

void auto_reset_cb(lv_event_t* e){
  if (lv_event_get_code(e) != LV_EVENT_CLICKED) return;
  engineOn = false; inPulse = false; stepIdx = 0; noneOn();
  lv_label_set_text(lv_obj_get_child(btnAutoStart, 0), "START");
  lv_label_set_text(lblAutoStatus, "Ready");
}

void build_auto_tab(lv_obj_t *tab){
  lv_obj_set_style_bg_color(tab, lv_color_hex(0x0B0F14), 0);
  lv_obj_set_style_text_color(tab, lv_color_white(), 0);

  lv_obj_t *title = lv_label_create(tab);
  lv_label_set_text(title, "AUTO");
  lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 6);

  lblAutoStatus = lv_label_create(tab);
  lv_label_set_text(lblAutoStatus, "Ready");
  lv_obj_align(lblAutoStatus, LV_ALIGN_TOP_MID, 0, 30);

  btnAutoStart = lv_btn_create(tab);
  lv_obj_set_size(btnAutoStart, 100, 36);
  lv_obj_align(btnAutoStart, LV_ALIGN_BOTTOM_MID, -60, -14);
  lv_obj_add_event_cb(btnAutoStart, auto_start_stop_cb, LV_EVENT_CLICKED, NULL);
  lv_obj_t *ls = lv_label_create(btnAutoStart);
  lv_label_set_text(ls, "START");
  lv_obj_center(ls);

  btnAutoReset = lv_btn_create(tab);
  lv_obj_set_size(btnAutoReset, 100, 36);
  lv_obj_align(btnAutoReset, LV_ALIGN_BOTTOM_MID, 60, -14);
  lv_obj_add_event_cb(btnAutoReset, auto_reset_cb, LV_EVENT_CLICKED, NULL);
  lv_obj_t *lr = lv_label_create(btnAutoReset);
  lv_label_set_text(lr, "RESET");
  lv_obj_center(lr);
}

// Engine tick for AUTO/CUSTOM (shared helper)
static void engine_tick(bool useCustom){
  if (!engineOn) return;
  unsigned long now = millis();

  if (!inPulse){
    // REST phase
    if (now - stateStart >= (unsigned long)restSeconds * 1000UL){
      // Move to next step, start pulse
      int ch = useCustom ? seq[stepIdx] : stepIdx;
      ch %= NUM_CHANNELS;
      setOnly(ch);
      inPulse = true;
      stateStart = now;
    } else {
      // still resting
      if (mode == MODE_AUTO && lblAutoStatus){
        lv_label_set_text(lblAutoStatus, "REST...");
      }
      if (mode == MODE_CUSTOM && lblCustomStatus){
        lv_label_set_text(lblCustomStatus, "REST...");
      }
    }
  } else {
    // PULSE phase
    if (now - stateStart >= (unsigned long)pulseSeconds * 1000UL){
      noneOn();
      inPulse = false;
      stateStart = now;
      stepIdx = (stepIdx + 1) % NUM_CHANNELS;
    } else {
      int ch = useCustom ? seq[stepIdx] : stepIdx;
      ch %= NUM_CHANNELS;
      if (mode == MODE_AUTO && lblAutoStatus){
        String s = "CH ";
        s += (ch+1);
        lv_label_set_text(lblAutoStatus, s.c_str());
      }
      if (mode == MODE_CUSTOM && lblCustomStatus){
        String s = "CH ";
        s += (ch+1);
        lv_label_set_text(lblCustomStatus, s.c_str());
      }
    }
  }
}

// ================== MANUAL (page 3) ==================
void manual_btn_cb(lv_event_t *e){
  if (lv_event_get_code(e) != LV_EVENT_CLICKED) return;

  // entering manual cancels others
  setMode(MODE_MANUAL);
  engineOn = false; inPulse = false; stepIdx = 0;

  int idx = (int)lv_event_get_user_data(e);
  // If this channel is already ON, turn all OFF; else set only this one
  bool wasOn = chState[idx];
  if (wasOn) {
    noneOn();
    if (lblManualStatus) lv_label_set_text(lblManualStatus, "None");
  } else {
    setOnly(idx);
    if (lblManualStatus){
      String s = "CH ";
      s += (idx+1);
      lv_label_set_text(lblManualStatus, s.c_str());
    }
  }

  // Update button colors
  for (int i=0;i<NUM_CHANNELS;i++){
    lv_obj_t *b = manualBtns[i];
    lv_obj_set_style_bg_color(b, chState[i] ? lv_palette_main(LV_PALETTE_GREEN)
                                            : lv_palette_darken(LV_PALETTE_GREY, 3), 0);
  }
}

void build_manual_tab(lv_obj_t *tab){
  lv_obj_set_style_bg_color(tab, lv_color_hex(0x0B0F14), 0);
  lv_obj_set_style_text_color(tab, lv_color_white(), 0);

  lv_obj_t *title = lv_label_create(tab);
  lv_label_set_text(title, "MANUAL");
  lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 6);

  lblManualStatus = lv_label_create(tab);
  lv_label_set_text(lblManualStatus, "None");
  lv_obj_align(lblManualStatus, LV_ALIGN_TOP_MID, 0, 30);

  // 2 columns x 4 rows
  int xs=25, ys=60, bw=90, bh=36, dx=110, dy=45;
  for(int i=0;i<NUM_CHANNELS;i++){
    int r=i/2, c=i%2;
    lv_obj_t *btn = lv_btn_create(tab);
    lv_obj_set_size(btn, bw, bh);
    lv_obj_align(btn, LV_ALIGN_TOP_LEFT, xs + c*dx, ys + r*dy);
    lv_obj_add_event_cb(btn, manual_btn_cb, LV_EVENT_CLICKED, (void*)i);
    lv_obj_set_style_bg_color(btn, lv_palette_darken(LV_PALETTE_GREY,3), 0);
    lv_obj_t *lbl = lv_label_create(btn);
    String name = "CH " + String(i+1);
    lv_label_set_text(lbl, name.c_str());
    lv_obj_center(lbl);
    manualBtns[i] = btn;
  }
}

// ================== CUSTOM (page 4) ==================
void custom_start_stop_cb(lv_event_t* e){
  if (lv_event_get_code(e) != LV_EVENT_CLICKED) return;
  if (!engineOn) setMode(MODE_CUSTOM);
  engineOn = !engineOn;
  inPulse = false;
  stepIdx = 0;
  stateStart = millis();
  noneOn();
  lv_label_set_text(lv_obj_get_child(btnCustomStart,0), engineOn ? "STOP" : "START");
}

void seq_plus_cb(lv_event_t* e){
  int i = (int)lv_event_get_user_data(e);
  seq[i] = (seq[i] + 1) % NUM_CHANNELS;
  String s = "Step "; s += (i+1); s += ": CH "; s += (seq[i]+1);
  lv_label_set_text(seqLbl[i], s.c_str());
  saveCfg();
}
void seq_minus_cb(lv_event_t* e){
  int i = (int)lv_event_get_user_data(e);
  seq[i] = (seq[i] + NUM_CHANNELS - 1) % NUM_CHANNELS;
  String s = "Step "; s += (i+1); s += ": CH "; s += (seq[i]+1);
  lv_label_set_text(seqLbl[i], s.c_str());
  saveCfg();
}

void build_custom_tab(lv_obj_t *tab){
  lv_obj_set_style_bg_color(tab, lv_color_hex(0x0B0F14), 0);
  lv_obj_set_style_text_color(tab, lv_color_white(), 0);

  lv_obj_t *title = lv_label_create(tab);
  lv_label_set_text(title, "CUSTOM");
  lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 6);

  lblCustomStatus = lv_label_create(tab);
  lv_label_set_text(lblCustomStatus, "Ready");
  lv_obj_align(lblCustomStatus, LV_ALIGN_TOP_MID, 0, 30);

  // Sequence editor
  for(int i=0;i<NUM_CHANNELS;i++){
    seqLbl[i] = lv_label_create(tab);
    String text = "Step " + String(i+1) + ": CH " + String(seq[i]+1);
    lv_label_set_text(seqLbl[i], text.c_str());
    lv_obj_align(seqLbl[i], LV_ALIGN_TOP_LEFT, 18, 56 + i*24);

    lv_obj_t *bm = lv_btn_create(tab);
    lv_obj_set_size(bm, 30, 22);
    lv_obj_align_to(bm, seqLbl[i], LV_ALIGN_OUT_RIGHT_MID, 70, 0);
    lv_obj_add_event_cb(bm, seq_minus_cb, LV_EVENT_CLICKED, (void*)i);
    lv_obj_t *lm = lv_label_create(bm); lv_label_set_text(lm, "-"); lv_obj_center(lm);

    lv_obj_t *bp = lv_btn_create(tab);
    lv_obj_set_size(bp, 30, 22);
    lv_obj_align_to(bp, bm, LV_ALIGN_OUT_RIGHT_MID, 34, 0);
    lv_obj_add_event_cb(bp, seq_plus_cb, LV_EVENT_CLICKED, (void*)i);
    lv_obj_t *lp = lv_label_create(bp); lv_label_set_text(lp, "+"); lv_obj_center(lp);
  }

  // Start/Stop
  btnCustomStart = lv_btn_create(tab);
  lv_obj_set_size(btnCustomStart, 100, 36);
  lv_obj_align(btnCustomStart, LV_ALIGN_BOTTOM_MID, 0, -14);
  lv_obj_add_event_cb(btnCustomStart, custom_start_stop_cb, LV_EVENT_CLICKED, NULL);
  lv_obj_t *ls = lv_label_create(btnCustomStart); lv_label_set_text(ls, "START"); lv_obj_center(ls);
}

// ================== Build Tabs ==================
void build_tabs(){
  tabview = lv_tabview_create(lv_screen_active()); // LVGL 9 signature
  // The default tab header is on top. We’ll keep it (top navigation)

  lv_obj_t *tab_settings = lv_tabview_add_tab(tabview, "SETTINGS");
  lv_obj_t *tab_auto     = lv_tabview_add_tab(tabview, "AUTO");
  lv_obj_t *tab_manual   = lv_tabview_add_tab(tabview, "MANUAL");
  lv_obj_t *tab_custom   = lv_tabview_add_tab(tabview, "CUSTOM");

  build_settings_tab(tab_settings);
  build_auto_tab(tab_auto);
  build_manual_tab(tab_manual);
  build_custom_tab(tab_custom);
}

// ================== Engines ==================
void tick_auto(){ if (mode == MODE_AUTO)   engine_tick(false); }
void tick_custom(){ if (mode == MODE_CUSTOM) engine_tick(true); }

// ================== Setup/Loop ==================
void setup(){
  Serial.begin(115200);
  for(int i=0;i<NUM_CHANNELS;i++){ pinMode(outputPins[i], OUTPUT); digitalWrite(outputPins[i], LOW); }

  loadCfg();
  lv_init();

  // Touch + display
  touchscreenSPI.begin(XPT2046_CLK, XPT2046_MISO, XPT2046_MOSI, XPT2046_CS);
  touchscreen.begin(touchscreenSPI);
  touchscreen.setRotation(0); // keep as-is; mapping handled in touchscreen_read()

  lv_display_t *disp = lv_tft_espi_create(SCREEN_WIDTH, SCREEN_HEIGHT, draw_buf, sizeof(draw_buf));
  lv_display_set_rotation(disp, LV_DISPLAY_ROTATION_270);  // portrait upright for your panel

  lv_indev_t *indev = lv_indev_create();
  lv_indev_set_type(indev, LV_INDEV_TYPE_POINTER);
  lv_indev_set_read_cb(indev, touchscreen_read);

  setup_tick();

  // Theme base
  lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x0B0F14), 0);
  lv_obj_set_style_text_color(lv_screen_active(), lv_color_white(), 0);

  build_tabs();

  // Start in SETTINGS, no mode running
  setMode(MODE_NONE);
  engineOn = false; inPulse = false; stepIdx = 0; stateStart = millis();
}

void loop(){
  lv_timer_handler();
  delay(5);

  // Tick engines
  tick_auto();
  tick_custom();
}
