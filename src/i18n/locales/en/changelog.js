const enChangelog = {
  title: 'Changelog',
  officialButton: 'Official Changelog',
  subtitle: 'History of T-1 firmware updates.',
  types: {
    major: 'Major',
    bugfix: 'Bugfix',
  },
  categories: {
    features: 'New features',
    enhancements: 'Enhancements',
    bugfixes: 'Fixes',
  },
  versions: [
  {
    "version": "2.1.3",
    "date": "March 2, 2026",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Fixed a bug where pattern quantization didn't work with SYNC IN.",
        "Fixed a bug where CC settings were sent duplicated during playback."
      ]
    }
  },
  {
    "version": "2.1.2",
    "date": "February 2, 2026",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Banks using the new voicing styles could not load."
      ]
    }
  },
  {
    "version": "2.1.1",
    "date": "December 18, 2025",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Fixed a crash when tapping a knob after changing tracks in latched view."
      ]
    }
  },
  {
    "version": "2.1.0",
    "date": "December 16, 2025",
    "type": "major",
    "highlight": true,
    "entries": {
      "features": [
        "Project Save/Load via T1 Config: complete backup/restore of the device state (.zip).",
        "Hold Mode: latch notes from the internal keyboard or external MIDI.",
        "Two new voicing styles: Up/Down and Climb Up/Down (Poly and Mono).",
        "Random sequence locking by parameter.",
        "FX Mode routing options: Omni, Same, Fixed.",
        "Filter active tracks in FX mode."
      ],
      "enhancements": [
        "Faster saving and loading.",
        "Auto-saved CC in tracks.",
        "Clearing PITCH returns the root note.",
        "Random RATE and TIME no longer follow DIVISION.",
        "FX tracks continue to run even when T-1 is stopped.",
        "Better value range of Value Buttons in CC mode.",
        "Option in T1 Config to output incoming CC and Pitch Bend."
      ],
      "bugfixes": [
        "More precise LED tempo visualization.",
        "Banks saved manually load correctly at boot.",
        "Lowering VOICING no longer triggers incorrect notes.",
        "Corrected note selection with alternative scales in Cycles.",
        "Program Change of banks 9–16 on MIDI channel 2 corrected.",
        "Fixed a crash when changing tracks in latched view.",
        "Cycles no longer change unexpectedly when the T-1 is stopped.",
        "The tempo is correctly saved and reloaded into the banks.",
        "Start/stop with analog clock now correctly resets the starting point.",
        "Pattern selection follows playback correctly.",
        "CCs can now be sent on all channels.",
        "Fixed an issue preventing pitches from being deleted in the PITCH menu.",
        "Program Change becomes instantaneous when playback is stopped.",
        "Updated CC edit behavior (correct button selection).",
        "Fixed a track delay issue that caused Cycle 2 to start.",
        "Random Repeats Time works correctly (no longer limited to max)."
      ]
    }
  },
  {
    "version": "2.0.14",
    "date": "May 1, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Removal of the limit of 8 editions per step."
      ]
    }
  },
  {
    "version": "2.0.13",
    "date": "April 27, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Fixed copying of step edits between pages (>16 steps)."
      ]
    }
  },
  {
    "version": "2.0.12",
    "date": "April 21, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Temp + CC did not work (regression since v2.0.7)."
      ]
    }
  },
  {
    "version": "2.0.11",
    "date": "April 21, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Fixed LED flickering on recent batches of T-1."
      ]
    }
  },
  {
    "version": "2.0.10",
    "date": "March 23, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Fixed a bug when making relative step edits CC changes."
      ]
    }
  },
  {
    "version": "2.0.9",
    "date": "March 14, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Multi-selection did not work for selections > 2 items (regression since v2.0.7)."
      ]
    }
  },
  {
    "version": "2.0.8",
    "date": "March 13, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Knob menus sometimes got stuck when opening with [CTRL] or RANDOM.",
        "Accent and random velocity behaved incorrectly (regression since v2.0.7)."
      ]
    }
  },
  {
    "version": "2.0.7",
    "date": "March 8, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "General stability greatly improved via fuzz testing.",
        "Resync of cycles when exiting edit/loop mode and when changing the number of cycles.",
        "Fixed crash with random cycles while editing.",
        "Empty step edits are correctly copied.",
        "Fixed chord logic/step edits across cycles.",
        "Step timing editing temporarily disabled for reimplementation."
      ]
    }
  },
  {
    "version": "2.0.6",
    "date": "February 13, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Muted cycles were not cleared with [CLEAR]."
      ]
    }
  },
  {
    "version": "2.0.5",
    "date": "February 5, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Editing step edits on pages 2–4 did not work (regression since v2.0.3)."
      ]
    }
  },
  {
    "version": "2.0.4",
    "date": "February 3, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "CC values were not sent when pressing VB in CC view during playback."
      ]
    }
  },
  {
    "version": "2.0.3",
    "date": "January 30, 2023",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "General stability release (fixed most crashes)."
      ]
    }
  },
  {
    "version": "2.0.2",
    "date": "November 21, 2022",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Fixed a bug in the voicing algorithm (regression since v2.0.0)."
      ]
    }
  },
  {
    "version": "2.0.1",
    "date": "December 13, 2022",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Fixed crash when encountering invalid patterns/banks."
      ]
    }
  },
  {
    "version": "2.0.0",
    "date": "December 9, 2022",
    "type": "major",
    "entries": {
      "features": [
        "Editing of parameters by step, including CCs.",
        "FX track type for processing MIDI input.",
        "Quick view display of parameters.",
        "Redesigned Cycles workflow: loop and multi-selection.",
        "Routing notes between tracks.",
        "Multi-channel support per track.",
        "Slew adjustment on random modulations.",
        "Free adjustment of Division / Time parameters.",
        "Random polyphonic/monophonic options.",
        "Repeats buffer saved in tracks (looper capacity)."
      ],
      "enhancements": [
        "Double-tap track to enter pulses view.",
        "Reorganization of the Cycles menu.",
        "Division macro behavior for Time and Rate.",
        "Stop all repeats of the track: [CLEAR].",
        "Updated random voicing behavior.",
        "Tempo compatibility with CCs.",
        "New manual by Synthdawg."
      ]
    }
  },
  {
    "version": "1.3.2",
    "date": "September 22, 2022",
    "type": "bugfix",
    "entries": {
      "bugfixes": [
        "Jumping steps with external clock.",
        "Potential T-1 crash with T1 Config."
      ]
    }
  }
],
}

export default enChangelog
