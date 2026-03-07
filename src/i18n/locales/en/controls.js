const enControls = {
  "STEPS": {
    "description": "Pattern length (number of steps). When STEPS changes, Euclidean pulses are redistributed. Length can be extended beyond 16 up to 64 steps across 4 pages.",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Set step count (1-16)"
      },
      {
        "key": "Press & Turn STEPS",
        "action": "Edit steps while viewing the STEPS page"
      },
      {
        "key": "Hold STEPS",
        "action": "Show steps view on VBs"
      },
      {
        "key": "Double-press STEPS",
        "action": "Lock steps view"
      },
      {
        "key": "Hold CTRL + Turn STEPS",
        "action": "Extend/reduce pattern length up to 64 steps"
      },
      {
        "key": "In STEPS view: Hold STEPS + Press VBx",
        "action": "Directly set the last active step"
      },
      {
        "key": "In STEPS view: Hold CTRL + BANK/PATTERN/TEMP/MUTE",
        "action": "Navigate pages 1–4 (1–64)"
      },
      {
        "key": "In STEPS view: Press CLEAR",
        "action": "Retrigger step (sequence reset)"
      }
    ]
  },
  "PULSES": {
    "description": "Number of Euclidean pulses distributed in the steps. You can also add or remove pulses manually in PULSES view via VBx.",
    "shortcuts": [
      {
        "key": "Turn PULSES",
        "action": "Add/remove Euclidean pulses"
      },
      {
        "key": "Press & Turn PULSES",
        "action": "Edit the pulses while viewing the page"
      },
      {
        "key": "Hold or Double-press PULSES",
        "action": "Show/lock pulse view"
      },
      {
        "key": "In pulse view: Press VBx",
        "action": "Add/remove a manual pulse"
      },
      {
        "key": "In pulse view: CTRL + VBx",
        "action": "Enter per-step edit mode on the step"
      },
      {
        "key": "In step edit pulses: Press BANK",
        "action": "Exit step edit mode"
      },
      {
        "key": "CTRL + Turn PULSES",
        "action": "ROTATE — shift the starting pattern"
      }
    ]
  },
  "CYCLES": {
    "description": "Track variations replayed in sequence on the pattern. By default, 4 active cycles are present. You can then edit certain cycles to create a progression. Each cycle replays its own version of the parameters.",
    "shortcuts": [
      {
        "key": "Hold or Double-press CYCLES",
        "action": "Show/lock cycle view"
      },
      {
        "key": "In cycle view: Press VBx",
        "action": "Select cycle(s) to edit"
      },
      {
        "key": "BANK flashing red",
        "action": "Indicates that cycle edit mode is active"
      },
      {
        "key": "Turn a parameter (eg: PITCH/REPEATS)",
        "action": "Lock the value in the selected cycle"
      },
      {
        "key": "Press BANK",
        "action": "Exit the edit mode cycle"
      },
      {
        "key": "CTRL + Turn CYCLES",
        "action": "Change the number of active cycles"
      },
      {
        "key": "CTRL + CYCLES + VBx",
        "action": "Directly set 1–16 active cycles"
      },
      {
        "key": "In cycle view: CLEAR + VBx",
        "action": "Clear cycle edits"
      }
    ]
  },
  "DIVISION": {
    "description": "Rhythmic value of the steps (time signature of the track): you can choose a division preset via the VBx. Possibility of free mode with resolution 96 PPQN.",
    "shortcuts": [
      {
        "key": "Turn DIVISION",
        "action": "Browse preset divisions"
      },
      {
        "key": "Hold or Double-press DIVISION",
        "action": "Show/lock division view"
      },
      {
        "key": "Press & Turn DIVISION",
        "action": "Edit the division while viewing the DIVISION page"
      },
      {
        "key": "In division view: Press VB1–VB7",
        "action": "Choose a quadruplet (1/1 to 1/64)"
      },
      {
        "key": "In division view: Press VB11–VB15",
        "action": "Choose a triplet (1/3 to 1/48)"
      },
      {
        "key": "Hold DIVISION + Press VBx",
        "action": "Choose a division directly from the view"
      },
      {
        "key": "CTRL + Turn DIVISION",
        "action": "Free division (96 PPQN)"
      }
    ]
  },
  "VELOCITY": {
    "description": "Base note velocity (1–127, default 100). PROBABILITY acts in a random bi-polar manner: on the left it first cuts the pulses (and their repeats), on the right it cuts individual notes (pulse or repeat).",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Change base velocity"
      },
      {
        "key": "Hold / Double-press",
        "action": "Show/lock VELOCITY view on VBs"
      },
      {
        "key": "[CTRL] + Turn",
        "action": "PROBABILITY — set the probability of silence (bi-polar)"
      },
      {
        "key": "[CTRL] + (PROBABILITY) + [VB9]-[VB11]",
        "action": "Left coarse: probability of cutting pulses (and associated repeats)"
      },
      {
        "key": "[CTRL] + (PROBABILITY) + [VB13]-[VB15]",
        "action": "Right coarse: probability of cutting notes (pulse or repeat)"
      },
      {
        "key": "[CTRL] + (PROBABILITY) + [VB1]-[VB7]",
        "action": "Fine tuning of probability"
      },
      {
        "key": "[CTRL] + (PROBABILITY) + [VB8]/[VB16]",
        "action": "Shift phase modulation"
      }
    ]
  },
  "SUSTAIN": {
    "description": "Length of notes relative to DIVISION. Applies to pulses and repeats; a new trigger cuts the previous note.",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Change note duration"
      },
      {
        "key": "Hold / Double-press",
        "action": "Show/lock SUSTAIN view on VBs"
      },
      {
        "key": "[VB1]-[VB16] (in view)",
        "action": "Choose a targeted length (VB8≈50%, VB16=100%)"
      },
      {
        "key": "Hold [VBx] + tap [CLEAR]",
        "action": "Hold step (latch) mode"
      }
    ],
    "notes": "Length is applied to notes and repeats; a new trigger cuts the previous note. Sustain 100% ≠ latch."
  },
  "REPEATS": {
    "description": "Note repetitions after each pulse. RAMP creates a velocity ramp on repetitions (up or down).",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Change the number of repetitions"
      },
      {
        "key": "[CTRL] + Turn",
        "action": "RAMP — velocity ramp on repetitions"
      },
      {
        "key": "In REPEATS view: Press VB8",
        "action": "Choke repeats on new pulse"
      },
      {
        "key": "In REPEATS view: Press VB16",
        "action": "Tail: overlapping repeats"
      },
      {
        "key": "In REPEATS view: Press CLEAR",
        "action": "Stop repeats"
      }
    ]
  },
  "TIME": {
    "description": "Time interval between note repetitions. PACE adjusts the acceleration or deceleration of the repetition rate.",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Change the repeat time interval"
      },
      {
        "key": "[CTRL] + Turn",
        "action": "PACE — adjust acceleration/deceleration"
      }
    ]
  },
  "ACCENT": {
    "description": "ACCENT adjusts the amount of variation applied to the base velocity (VELOCITY). GROOVE chooses the variation form (8 templates: presets + waves). The two work together.",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Adjust the amount of emphasis (velocity variation)"
      },
      {
        "key": "Hold / Double-press",
        "action": "Show/lock ACCENT view"
      },
      {
        "key": "[CTRL] + Turn",
        "action": "GROOVE — select template"
      },
      {
        "key": "[CTRL] + Press (GROOVE)",
        "action": "Show GROOVE view on VBs"
      },
      {
        "key": "[VB1]-[VB7] (ACCENT view)",
        "action": "Fine accent"
      },
      {
        "key": "[VB9]-[VB15] (ACCENT view)",
        "action": "Coarse accent bi-polar"
      },
      {
        "key": "[VB8]/[VB16] (ACCENT view)",
        "action": "Groove tempo ÷2 / ×2"
      },
      {
        "key": "[VB1]-[VB4] / [VB9]-[VB12] (GROOVE view)",
        "action": "Presets / waves"
      }
    ]
  },
  "TIMING": {
    "description": "TIMING shifts certain notes earlier or later (micro-timing) to humanize the groove. DELAY shifts all notes on the track ahead/back according to note divisions.",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Adjust the micro-timing of targeted notes"
      },
      {
        "key": "Press & Turn TIMING",
        "action": "Iterative micro-timing while viewing the page"
      },
      {
        "key": "Hold / Double-press",
        "action": "Show/lock TIMING view"
      },
      {
        "key": "[VB9]-[VB11] / [VB13]-[VB15]",
        "action": "Coarse: early/late"
      },
      {
        "key": "[VB1]-[VB7]",
        "action": "Fine timing"
      },
      {
        "key": "[VB4] + [VB12]",
        "action": "No offset (on-grid)"
      },
      {
        "key": "[VB8] / [VB16]",
        "action": "Target note division x2/x4 (both lit = x1)"
      },
      {
        "key": "[CTRL] + Turn",
        "action": "DELAY — overall track delay"
      },
      {
        "key": "[CTRL] + Press & Turn DELAY",
        "action": "Iterative delay with visualization"
      },
      {
        "key": "[CTRL] + (DELAY) + [VB11|10|9]",
        "action": "Early delay: 1/16, 1/8, 1/4"
      },
      {
        "key": "[CTRL] + (DELAY) + [VB13|14|15]",
        "action": "Late delay: 1/16, 1/8, 1/4"
      }
    ]
  },
  "PITCH": {
    "description": "Keyboard-style pitch transposition in the active scale. HARMONY creates chord variations: each click moves one note within the scale.",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Transpose by step in the scale"
      },
      {
        "key": "Double-press",
        "action": "Lock keyboard view (VBs)"
      },
      {
        "key": "Hold PITCH + VBx",
        "action": "Add/remove notes in the pitch menu"
      },
      {
        "key": "[CTRL] + Turn",
        "action": "HARMONY — chord variation (1 note / click)"
      },
      {
        "key": "[CTRL] + [VB16] in keyboard view",
        "action": "Octave −1"
      }
    ],
    "notes": "Double-press (PITCH) locks keyboard view. [CTRL]+[VB16] = −1 octave. Without notes in Pitch = nothing plays with VOICING."
  },
  "VOICING": {
    "description": "Reorders notes set in PITCH across octaves. STYLE sets the playback algorithm (Poly/Mono, Ramp/Climb/Up-Down) and directly influences the melodic behavior.",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Change the order of voices (bipolar)"
      },
      {
        "key": "[CTRL] + (STYLE) → [VBx]",
        "action": "Select play style"
      }
    ],
    "details": [
      "VB1 PolyFixed",
      "VB2 PolyRamp",
      "VB3 PolyClimb",
      "VB4 PolyUp/Down ✦",
      "VB5 PolyClimbUp/Down ✦",
      "VB8 Direction UP",
      "VB9 MonoFixed",
      "VB10 MonoRamp",
      "VB11 MonoClimb",
      "VB12 MonoUp/Down ✦",
      "VB13 MonoClimbUp/Down ✦",
      "VB16 Direction DOWN"
    ],
    "notes": "✦ New styles in v2.1.0. VB8 = UP direction, VB16 = DOWN direction. Without notes in Pitch = nothing plays."
  },
  "RANGE": {
    "description": "Controls the extent and speed of transformation of notes from PITCH. PHRASE chooses the melodic form from 8 templates (Cad 1–4, Saw, Triangle, Sine, Pulse).",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Change the modulation range"
      },
      {
        "key": "[CTRL] + Turn",
        "action": "PHRASE — select form (cadence/LFO)"
      },
      {
        "key": "[CTRL] + PHRASE + [VBx]",
        "action": "Direct selection of the phrase template"
      }
    ],
    "details": [
      "VB1 Cad 1",
      "VB2 Cad 2",
      "VB3 Cad 3",
      "VB4 Cad 4",
      "VB9 Saw",
      "VB10 Triangle",
      "VB11 Sine",
      "VB12 Pulse"
    ]
  },
  "SCALE": {
    "description": "Scale used by the track. ROOT defines the root note. 8 predefined scales + 1 customizable scale (User).",
    "shortcuts": [
      {
        "key": "Turn",
        "action": "Select scale"
      },
      {
        "key": "Hold SCALE + VBx",
        "action": "Direct selection of scale on VBs"
      },
      {
        "key": "[CTRL] + Turn",
        "action": "ROOT — set root note"
      }
    ],
    "details": [
      "VB9 Chromatic",
      "VB10 Major",
      "VB11 Minor",
      "VB12 Pentatonic",
      "VB13 Hirajoshi",
      "VB14 Iwato",
      "VB15 Tetratonic",
      "VB16 User"
    ]
  },
  "TEMPO": {
    "description": "BPM of internal clock (24–280, default 120). The tempo acts on the entire bank and is saved with the bank.",
    "shortcuts": [
      {
        "key": "Turn TEMPO",
        "action": "Change BPM (1 BPM per step)"
      },
      {
        "key": "Hold & Turn TEMPO",
        "action": "Fine adjustment with direct viewing"
      },
      {
        "key": "Hold / Double-press TEMPO",
        "action": "Show/lock tempo view"
      },
      {
        "key": "Hold TEMPO + VBx",
        "action": "Quick jump in steps (24 → 280)"
      },
      {
        "key": "Hold TEMPO + VB6",
        "action": "Quick reset to 120 BPM"
      },
      {
        "key": "[CTRL] + Turn",
        "action": "Adjust the brightness of the LEDs"
      }
    ],
    "notes": "If an external clock takes priority (Analog > MIDI > Link), the internal tempo is ignored."
  },
  "LENGTH": {
    "description": "Reduces the loop length of the track. QUANTIZE (secondary) sets when a pending pattern starts (bar/subdivision).",
    "shortcuts": [
      {
        "key": "Turn LENGTH",
        "action": "Reduce track loop length"
      },
      {
        "key": "Hold / Double-press LENGTH",
        "action": "Show/lock length view"
      },
      {
        "key": "[CTRL] + Press QUANTIZE",
        "action": "Show quantize view"
      },
      {
        "key": "[CTRL] + Turn QUANTIZE",
        "action": "Change the quantize of the pattern"
      },
      {
        "key": "In QUANTIZE view: Press VBx",
        "action": "Direct selection (1–8, 16, 1/2, 1/4, 1/8)"
      }
    ],
    "notes": "LENGTH is stored at track level. QUANTIZE is stored at the pattern level."
  },
  "CHANNEL": {
    "description": "MIDI channel of the track (1–16). Several channels can be selected on the same track. OUTPUT routes a track to the input of another track.",
    "shortcuts": [
      {
        "key": "Turn CHANNEL",
        "action": "Change the MIDI channel of the track"
      },
      {
        "key": "Press & Turn CHANNEL",
        "action": "Change the channel while viewing the page"
      },
      {
        "key": "Hold / Double-press CHANNEL",
        "action": "Show/lock channel view"
      },
      {
        "key": "In view CHANNEL: Press VBx",
        "action": "Select one or more channels"
      },
      {
        "key": "[CTRL] + CHANNEL + [VBx]",
        "action": "OUTPUT — route to another track"
      }
    ],
    "notes": "By default, Track N corresponds to Channel N."
  },
  "RANDOM": {
    "description": "RANDOM controls a random modulation sequence over 16 steps. Turn RANDOM sets the probability of application (0–100%). CTRL + Turn RANDOM (RATE) sets the speed/division of this sequence. Hold RANDOM + Turn another knob adjusts the bi-polar intensity of the chosen parameter.",
    "shortcuts": [
      {
        "key": "Turn RANDOM",
        "action": "Adjust overall probability of randomization (0–100%)"
      },
      {
        "key": "Hold / Double-press RANDOM",
        "action": "Show/lock random view"
      },
      {
        "key": "Hold RANDOM + Turn Knob",
        "action": "Adjust the bi-polar intensity of the targeted parameter"
      },
      {
        "key": "Hold RANDOM + Press Knob + VBx",
        "action": "Fine tune and select the random value of the parameter"
      },
      {
        "key": "Hold RANDOM + Press Knob + VB8 / VB16",
        "action": "Shift the phase of the random sequence (earlier/later)"
      },
      {
        "key": "CTRL + RANDOM + Turn Knob",
        "action": "Apply slew (smoothing) to the random lane of the parameter"
      },
      {
        "key": "CTRL + Turn RANDOM (RATE)",
        "action": "Set division/speed of random sequence"
      }
    ],
    "notes": "The manual states that TEMPO is not one of the randomizable parameters."
  },
  "PLAY": {
    "description": "T-1 Global Transport: Starts/stops playback. The status LED reflects the state of the clock (active playback, Link, etc.).",
    "shortcuts": [
      {
        "key": "[PLAY]",
        "action": "Start/stop transport"
      },
      {
        "key": "[CTRL] + [PLAY]",
        "action": "Isolated play (without MIDI / Link / analog reset)"
      },
      {
        "key": "[CLEAR] + [PLAY]",
        "action": "Kill all stuck MIDI notes (panic)"
      }
    ],
    "notes": "[CTRL]+[PLAY] launches in isolated mode (without Start/Stop MIDI, Link or analog reset). [CLEAR]+[PLAY] sends a panic to cut stuck MIDI notes."
  },
  "BANK": {
    "description": "Selects the active bank (1–16). In any mode: return to home view (tracks). SAVE is the only save level of the T-1.",
    "shortcuts": [
      {
        "key": "[BANK]",
        "action": "Return home / exit current mode"
      },
      {
        "key": "Hold [BANK]",
        "action": "Show banks view"
      },
      {
        "key": "Hold [BANK] + [VBx]",
        "action": "Select bank 1–16"
      },
      {
        "key": "[CTRL] + [BANK] + [VBx]",
        "action": "Save the current bank"
      },
      {
        "key": "Hold [BANK] + [VBx] (1 sec)",
        "action": "Recharge bank (green flash = OK)"
      },
      {
        "key": "[CLEAR] + [BANK] + [VBx] + [VBx]",
        "action": "Clear bank (double confirmation)"
      },
      {
        "key": "Hold [CTRL]+[COPY]+[BANK]+[src→dst]",
        "action": "Copy bank"
      },
      {
        "key": "Start T-1 by holding [BANK]",
        "action": "Full reload"
      }
    ],
    "notes": "The manual specifies: there is no standalone manual track/pattern save; saving happens at BANK level. The T-1 also has autosave and reloads the previous bank at startup."
  },
  "PATTERN": {
    "description": "Selects the active pattern (1–16). SELECT (secondary) allows silent selection without interrupting current playback.",
    "shortcuts": [
      {
        "key": "Hold [PATTERN]",
        "action": "Show patterns view"
      },
      {
        "key": "[PATTERN] + [VBx]",
        "action": "Select pattern"
      },
      {
        "key": "[CTRL] + [PATTERN] + [VBx]",
        "action": "Silent selection (without interruption)"
      },
      {
        "key": "Press [VBx] + [VBy] + ...",
        "action": "Chain patterns in order"
      },
      {
        "key": "[CLEAR] + [PATTERN] + [VBx]",
        "action": "Clear pattern"
      },
      {
        "key": "Hold [CTRL]+[COPY]+[PATTERN]+[src→dst]",
        "action": "Copy pattern"
      }
    ]
  },
  "CTRL": {
    "description": "T-1 global modifier. Maintained, it gives access to the secondary functions of the knobs/buttons and to advanced selection/editing actions.",
    "shortcuts": [
      {
        "key": "Hold [CTRL] + Turn (knob)",
        "action": "Access the secondary function of the knob"
      },
      {
        "key": "Hold [CTRL] + [button]",
        "action": "Access secondary function"
      },
      {
        "key": "Hold [CTRL] + [VBx] + [VBy]",
        "action": "Multiple selection via VBs (when the mode allows it)"
      },
      {
        "key": "[CTRL] + double-tap (track)",
        "action": "Assign MAGENTA status (FX track)"
      },
      {
        "key": "[CTRL] + [VB16] (keyboard view)",
        "action": "Octave −1"
      },
      {
        "key": "[CTRL] + Turn (TEMPO)",
        "action": "Adjust the brightness of the LEDs"
      },
      {
        "key": "[CTRL] + [PLAY]",
        "action": "Isolated play without MIDI / Link"
      },
      {
        "key": "[CTRL] + [BANK] + [VBx]",
        "action": "Save bank"
      }
    ]
  },
  "CLEAR": {
    "description": "Clears the current target (track/pattern/bank depending on combination). With [CTRL], switch to COPY mode to duplicate tracks, patterns or banks.",
    "shortcuts": [
      {
        "key": "[CLEAR]",
        "action": "Enter clear mode for the current target"
      },
      {
        "key": "[CTRL] + [CLEAR]",
        "action": "Enter copy mode"
      },
      {
        "key": "[CLEAR] + [VBx]",
        "action": "Clear track"
      },
      {
        "key": "[CLEAR] + [BANK] + [VBx] + [VBx]",
        "action": "Clear bank (double confirmation)"
      },
      {
        "key": "[CLEAR] + [PATTERN] + [VBx]",
        "action": "Clear pattern"
      },
      {
        "key": "Hold [CTRL]+[COPY]+[src→dst]",
        "action": "Copy track"
      },
      {
        "key": "Hold [CTRL]+[COPY]+[BANK]+[src→dst]",
        "action": "Copy bank"
      },
      {
        "key": "Hold [CTRL]+[COPY]+[PATTERN]+[src→dst]",
        "action": "Copy pattern"
      },
      {
        "key": "Hold [VBx] + tap [CLEAR]",
        "action": "Hold step (latch) mode"
      }
    ]
  },
  "TEMP": {
    "description": "Temporary performance modifier: Hold [TEMP] + Turn (param) applies a momentary variation. Releasing [TEMP] restores the original value.",
    "shortcuts": [
      {
        "key": "Hold [TEMP] + Turn (param)",
        "action": "Temporarily change a setting"
      },
      {
        "key": "Hold [TEMP] + [PATTERN] + Turn (param)",
        "action": "Apply relative changes to parameters at pattern scope"
      },
      {
        "key": "Double-tap [TEMP]",
        "action": "Lock active TEMP selection"
      },
      {
        "key": "Hold [TEMP] + [PATTERN] + [VBx]",
        "action": "Save temporary changes to pattern x"
      }
    ],
    "notes": "Ideal live for making a break/sweep then instantly returning to the basic setting, without rewriting the final value."
  },
  "MUTE": {
    "description": "Track mute control. Hold [MUTE] + [VBx] prepares a mute toggle, applied when released. [CTRL]+[MUTE]+[VBx] applies immediate mute/unmute.",
    "shortcuts": [
      {
        "key": "Hold [MUTE] + [VBx]",
        "action": "Mute/unmute (applied on release)"
      },
      {
        "key": "Release [MUTE]",
        "action": "Apply the prepared action on the targeted tracks"
      },
      {
        "key": "Double-tap [MUTE]",
        "action": "Lock active mute selection"
      },
      {
        "key": "[CTRL] + [MUTE] + [VBx]",
        "action": "Quick mute / immediate unmute"
      }
    ]
  },
  "VB": {
    "description": "16 illuminated multifunction buttons (Value Buttons). Colored illumination indicates active mode. Default: selection and visualization of tracks.",
    "shortcuts": [
      {
        "key": "[VBx] (BANK mode)",
        "action": "Select bank 1–16"
      },
      {
        "key": "[VBx] (PATTERN mode)",
        "action": "Select pattern 1–16"
      },
      {
        "key": "[VBx] (TRACK mode)",
        "action": "Select track 1–16"
      },
      {
        "key": "[VBx] + [VBy] (track view)",
        "action": "Multi-track selection"
      },
      {
        "key": "[CTRL] + [VBx] (track view)",
        "action": "Cycle track type: Note / CC / FX"
      },
      {
        "key": "Double-tap [VBx] (depending on type)",
        "action": "Switch to Pulse/CC/FX view"
      },
      {
        "key": "[VBx] (keyboard view)",
        "action": "Play/select notes in scale"
      },
      {
        "key": "VB8",
        "action": "Direction UP (voicing)"
      },
      {
        "key": "VB16",
        "action": "Direction DOWN · [CTRL]+VB16 = Octave −1"
      },
      {
        "key": "Hold [VBx] + tap [CLEAR]",
        "action": "Hold step (latch) mode"
      }
    ]
  }
}

export default enControls
