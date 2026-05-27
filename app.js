document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MODULE 1: BASS FRETBOARD LOGIC
    ========================================================= */
    const FRETS = 24;
    const TUNING = [7, 2, 9, 4, 11]; // G, D, A, E, B
    const STRINGS = 5;

    const BASE_W = 1650;
    const BASE_H = 240;
    const X_START = 50;
    const Y_START = 30;
    const FRET_WIDTH = 65;
    const STRING_GAP = 40;

    const NOTES_FLAT =  ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    const NOTES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    const SCALES = {
        'major':    [0, 2, 4, 5, 7, 9, 11],
        'minor':    [0, 2, 3, 5, 7, 8, 10],
        'ionian':     [0, 2, 4, 5, 7, 9, 11],
        'dorian':     [0, 2, 3, 5, 7, 9, 10],
        'phrygian':   [0, 1, 3, 5, 7, 8, 10],
        'lydian':     [0, 2, 4, 6, 7, 9, 11],
        'mixolydian': [0, 2, 4, 5, 7, 9, 10],
        'aeolian':    [0, 2, 3, 5, 7, 8, 10],
        'locrian':    [0, 1, 3, 5, 6, 8, 10],
        'maj_pent': [0, 2, 4, 7, 9],
        'min_pent': [0, 3, 5, 7, 10],
        'maj':      [0, 4, 7],
        'min':      [0, 3, 7],
        'dim':      [0, 3, 6],
        'aug':      [0, 4, 8],
        'maj7':     [0, 4, 7, 11],
        'dom7':     [0, 4, 7, 10],
        'min7':     [0, 3, 7, 10],
        'm7b5':     [0, 3, 6, 10],
        'aug7':     [0, 4, 8, 10], 
        'dim7':     [0, 3, 6, 9],
        'mM7':      [0, 3, 7, 11]
    };

    const INTERVAL_NAMES = {
        'major':    ['R', '2', '3', '4', '5', '6', '7'],
        'minor':    ['R', '2', 'b3', '4', '5', 'b6', 'b7'],
        'ionian':     ['R', '2', '3', '4', '5', '6', '7'],
        'dorian':     ['R', '2', 'b3', '4', '5', '6', 'b7'],
        'phrygian':   ['R', 'b2', 'b3', '4', '5', 'b6', 'b7'],
        'lydian':     ['R', '2', '3', '#4', '5', '6', '7'],
        'mixolydian': ['R', '2', '3', '4', '5', '6', 'b7'],
        'aeolian':    ['R', '2', 'b3', '4', '5', 'b6', 'b7'],
        'locrian':    ['R', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
        'maj_pent': ['R', '2', '3', '5', '6'],
        'min_pent': ['R', 'b3', '4', '5', 'b7'],
        'maj':      ['R', '3', '5'],
        'min':      ['R', 'b3', '5'],
        'dim':      ['R', 'b3', 'b5'],
        'aug':      ['R', '3', '#5'],
        'maj7':     ['R', '3', '5', '7'],
        'dom7':     ['R', '3', '5', 'b7'],
        'min7':     ['R', 'b3', '5', 'b7'],
        'm7b5':     ['R', 'b3', 'b5', 'b7'],
        'aug7':     ['R', '3', '#5', 'b7'], 
        'dim7':     ['R', 'b3', 'b5', 'bb7'],
        'mM7':      ['R', 'b3', '5', '7']
    };
    
    const ARPEGGIO_SHAPES = {
        'maj': { '1st': [[0,0], [0,4], [-1,2], [-2,2]], '2nd': [[0,0], [-1,-1], [-1,2], [-2,2]], '4th': [[0,0], [-1,-1], [-2,-3], [-3,-3]] },
        'min': { '1st': [[0,0], [-1,-2], [-1,2], [-2,2]], '2nd': [[0,0], [0,3], [-1,2], [-2,2]], '4th': [[0,0], [-1,-2], [-2,-3], [-3,-3]] },
        'dim': { '1st': [[0,0], [-1,-2], [-1,1], [-2,2]], '2nd': [[0,0], [0,3], [-1,1], [-2,2]], '4th': [[0,0], [-1,-2], [-2,-4], [-3,-3]] },
        'aug': { '1st': [[0,0], [0,4], [-1,3], [-2,2]], '2nd': [[0,0], [-1,-1], [-1,3], [-2,2]], '4th': [[0,0], [-1,-1], [-2,-2], [-3,-3]] },
        'maj7': { '1st': [[0,0], [0,4], [-1,2], [-2,1], [-2,2]], '2nd': [[0,0], [-1,-1], [-1,2], [-2,1], [-2,2]], '4th': [[0,0], [-1,-1], [-2,-3], [-3,-4], [-3,-3]] },
        'dom7': { '1st': [[0,0], [0,4], [-1,2], [-2,0], [-2,2]], '2nd': [[0,0], [-1,-1], [-1,2], [-2,0], [-2,2]], '4th': [[0,0], [-1,-1], [-2,-3], [-2,0], [-3,-3]] },
        'min7': { '1st': [[0,0], [-1,-2], [-1,2], [-2,0], [-2,2]], '2nd': [[0,0], [0,3], [-1,2], [-2,0], [-2,2]], '4th': [[0,0], [-1,-2], [-2,-3], [-2,0], [-3,-3]] },
        'm7b5': { '1st': [[0,0], [-1,-2], [-1,1], [-2,0], [-2,2]], '2nd': [[0,0], [0,3], [-1,1], [-2,0], [-2,2]], '4th': [[0,0], [-1,-2], [-2,-4], [-2,0], [-3,-3]] },
        'aug7': { '1st': [[0,0], [0,4], [-1,3], [-2,0], [-2,2]], '2nd': [[0,0], [-1,-1], [-1,3], [-2,0], [-2,2]], '4th': [[0,0], [-1,-1], [-2,-2], [-2,0], [-3,-3]] }, 
        'dim7': { '1st': [[0,0], [-1,-2], [-1,1], [-2,-1], [-2,2]], '2nd': [[0,0], [0,3], [-1,1], [-2,-1], [-2,2]], '4th': [[0,0], [-1,-2], [-2,-4], [-2,-1], [-3,-3]] },
        'mM7': { '1st': [[0,0], [-1,-2], [-1,2], [-2,1], [-2,2]], '2nd': [[0,0], [0,3], [-1,2], [-2,1], [-2,2]], '4th': [[0,0], [-1,-2], [-2,-3], [-3,-4], [-3,-3]] }
    };

    const CN_INTERVAL_MAP = {
        'R': '純1', 'b2': '小2', '2': '大2', 'b3': '小3', '3': '大3', '4': '純4', '#4': '增4', 'b5': '減5',
        '5': '純5', '#5': '增5', 'b6': '小6', '6': '大6', 'b7': '小7', 'bb7': '減7', '7': '大7'
    };

    const SOLFEGE_MAP = {
        'R': 'Do', 'b2': 'Ra', '2': 'Re', 'b3': 'Me', '3': 'Mi', '4': 'Fa', '#4': 'Fi', 'b5': 'Se', 
        '5': 'So', '#5': 'Si', 'b6': 'Le', '6': 'La', 'b7': 'Te', '7': 'Si', 'bb7': 'La'
    };

    const SCALE_MODE_NAMES = {
        'major': ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"],
        'minor': ["Aeolian", "Locrian", "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian"],
        'maj_pent': ["Shape 1", "Shape 2", "Shape 3", "Shape 4", "Shape 5"],
        'min_pent': ["Shape 1", "Shape 2", "Shape 3", "Shape 4", "Shape 5"]
    };

    const DIATONIC_CHORDS = [
        { name: 'Imaj7', interval: 0, type: 'maj7' },
        { name: 'IIm7', interval: 2, type: 'min7' },
        { name: 'IIIm7', interval: 4, type: 'min7' },
        { name: 'IVmaj7', interval: 5, type: 'maj7' },
        { name: 'V7', interval: 7, type: 'dom7' },
        { name: 'VIm7', interval: 9, type: 'min7' },
        { name: 'VIIm7b5', interval: 11, type: 'm7b5' }
    ];
    
    const MINOR_DIATONIC_CHORDS = [
        { name: 'Im7', interval: 0, type: 'min7' },
        { name: 'IIm7b5', interval: 2, type: 'm7b5' },
        { name: 'bIIImaj7', interval: 3, type: 'maj7' },
        { name: 'IVm7', interval: 5, type: 'min7' },
        { name: 'Vm7', interval: 7, type: 'min7' },
        { name: 'bVImaj7', interval: 8, type: 'maj7' },
        { name: 'bVII7', interval: 10, type: 'dom7' }
    ];

    let currentRoot = 0;
    let currentScaleType = 'maj7';
    let currentViewMode = 'intervals';
    let exerciseMode = 'arpeggio'; 
    let selectedStrings = [2, 3, 4]; 

    let activeAnchors = new Set([]); 
    let generatedPositions = []; 
    let isFretboardMultiMode = false;

    const exModeSel = document.getElementById('exerciseModeSelect');
    const keySel = document.getElementById('keySelect');
    const scaleSel = document.getElementById('scaleSelect');
    const chordSel = document.getElementById('chordTypeSelect');
    const arpStrSel = document.getElementById('arpeggioStringSelect');
    const arpInvSel = document.getElementById('arpeggioInversionSelect');
    const strPairSel = document.getElementById('stringPairSelect');
    const strTriSel = document.getElementById('stringTripletSelect');
    const strQuadSel = document.getElementById('stringQuadSelect');
    const strQuinSel = document.getElementById('stringQuintSelect');
    const viewModeSel = document.getElementById('viewModeSelect');
    const multiCheck = document.getElementById('multiModeCheck');
    const parallelSel = document.getElementById('parallelModeSelect');
    const chromaticSel = document.getElementById('chromaticFilterSelect');

    function getNoteValue(stringIdx, fret) { return (TUNING[stringIdx] + fret) % 12; }
    
    function getNoteName(val, interval, masterRootVal = 0) {
        const PREFERS_SHARP = [2, 4, 7, 9, 11]; 
        let useSharp = PREFERS_SHARP.includes(masterRootVal);
        if (interval) {
            if (interval.includes('#')) useSharp = true;
            if (interval.includes('b')) useSharp = false;
        }
        return useSharp ? NOTES_SHARP[val] : NOTES_FLAT[val];
    }
    
    function getIntervalLabel(noteVal, customRoot = null, customType = null) {
        if (exerciseMode === 'parallel' || exerciseMode === 'chromatic') {
            const CHROMATIC_INTERVALS = ['R', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
            let rootOffset = (noteVal - (customRoot !== null ? customRoot : parseInt(currentRoot)) + 12) % 12;
            return CHROMATIC_INTERVALS[rootOffset];
        }

        let typeToUse = customType !== null ? customType : currentScaleType;
        if (exerciseMode === 'pair_drill' || exerciseMode === 'triplet_drill' || exerciseMode === 'quad_drill' || exerciseMode === 'quint_drill' || ((exerciseMode === 'diatonic' || exerciseMode === 'diatonic_minor') && customType === null)) {
            typeToUse = exerciseMode === 'diatonic_minor' ? 'minor' : 'major';
        }
        
        let rootToUse = customRoot !== null ? customRoot : parseInt(currentRoot);
        const scaleIntervals = SCALES[typeToUse];
        if (!scaleIntervals) return null;
        const scaleNotes = scaleIntervals.map(i => (rootToUse + i) % 12);
        const idx = scaleNotes.indexOf(noteVal);
        if (idx !== -1) return INTERVAL_NAMES[typeToUse][idx];
        return null;
    }

    function getSolfegeLabel(noteVal) {
        let interval = getIntervalLabel(noteVal);
        return SOLFEGE_MAP[interval] || interval || "?";
    }

    function generateDynamicPositions(scaleNotes) {
        let positions = [];
        let bStringBase = TUNING[4]; 
        let modeNames = SCALE_MODE_NAMES[currentScaleType] || [];
        for (let f = 0; f <= 22; f++) {
            let noteVal = (bStringBase + f) % 12;
            let scaleIndex = scaleNotes.indexOf(noteVal);
            if (scaleIndex !== -1) {
                let modeName = modeNames[scaleIndex % modeNames.length] || "";
                positions.push({ anchorFret: f, noteVal: noteVal, modeName: modeName, id: f });
            }
        }
        return positions;
    }

    function generateSequenceDrillPositions() {
        let positions = [];
        let scaleIntervals = SCALES['major']; 
        let scaleNotes = scaleIntervals.map(i => (parseInt(currentRoot) + i) % 12);
        let modeNames = SCALE_MODE_NAMES['major'];
        let sortedStrings = [...selectedStrings].sort((a,b) => b-a);

        for (let f = 0; f <= FRETS; f++) {
            let startString = sortedStrings[0]; 
            let noteVal = getNoteValue(startString, f);
            let scaleIdx = scaleNotes.indexOf(noteVal); 

            if (scaleIdx !== -1) {
                let stepNotes = [];
                let validSequence = true;
                let currentScaleStep = scaleIdx;
                
                for (let i = 0; i < sortedStrings.length; i++) {
                    let s = sortedStrings[i];
                    let searchStart = f; 
                    for (let n = 0; n < 3; n++) {
                        let targetVal = scaleNotes[currentScaleStep % 7];
                        let foundFret = -1;
                        for (let scan = 0; scan < 6; scan++) {
                            let tryFret = searchStart + scan;
                            if (tryFret > FRETS) continue;
                            if (getNoteValue(s, tryFret) === targetVal) { foundFret = tryFret; break; }
                        }
                        if (foundFret === -1) { validSequence = false; break; }
                        stepNotes.push({ s: s, fret: foundFret, val: getNoteValue(s, foundFret) });
                        currentScaleStep++;
                    }
                    if (!validSequence) break;
                }
                if (validSequence) {
                    let solfegeStart = SOLFEGE_MAP[INTERVAL_NAMES['major'][scaleIdx]];
                    positions.push({
                        id: f, label: `Start: ${solfegeStart}`,
                        subLabel: `${modeNames[scaleIdx]} (${sortedStrings.length}-Str)`,
                        notes: stepNotes
                    });
                }
            }
        }
        return positions;
    }

    function getNotesForAnchor(anchorId, scaleNotes) {
        if (exerciseMode === 'arpeggio' || exerciseMode === 'diatonic' || exerciseMode === 'diatonic_minor') {
            let stringIdx = parseInt(arpStrSel.value);
            let chordType = chordSel.value;
            let targetRoot = parseInt(currentRoot);
            let shape = anchorId;
            let inv = (exerciseMode === 'arpeggio') ? (parseInt(arpInvSel.value) || 0) : 0;

            if (exerciseMode === 'diatonic' || exerciseMode === 'diatonic_minor') {
                let dIndex = parseInt(anchorId.split('_')[1]);
                let dc = (exerciseMode === 'diatonic') ? DIATONIC_CHORDS[dIndex] : MINOR_DIATONIC_CHORDS[dIndex];
                chordType = dc.type;
                targetRoot = (parseInt(currentRoot) + dc.interval) % 12;
                shape = '1st'; 
                inv = 0;
            }

            let intervals = SCALES[chordType] || SCALES['major'];
            let activeNotes = [];

            if (inv === 0) {
                let shapeOffsets = ARPEGGIO_SHAPES[chordType][shape];
                if (!shapeOffsets) shapeOffsets = ARPEGGIO_SHAPES[chordType]['1st']; 
                
                let anchorFret = -1;
                let minFretOffset = Math.min(...shapeOffsets.map(o => o[1]));
                for (let f = 1; f <= 20; f++) {
                    if (getNoteValue(stringIdx, f) === targetRoot) {
                        if (f + minFretOffset >= 0) { anchorFret = f; break; }
                    }
                }

                if (anchorFret !== -1) {
                    shapeOffsets.forEach(offset => {
                        let s = stringIdx + offset[0];
                        let f = anchorFret + offset[1];
                        if (s >= 0 && s < STRINGS && f >= 0 && f <= FRETS) {
                            activeNotes.push({ 
                                s: s, fret: f, val: getNoteValue(s, f), 
                                isRoot: offset[0] === 0 && offset[1] === 0,
                                displayRoot: targetRoot,
                                displayType: chordType
                            });
                        }
                    });
                }
            } 
            else {
                let bassInterval = intervals[inv % intervals.length];
                let bassNoteVal = (targetRoot + bassInterval) % 12;
                let chordNotes = intervals.map(i => (targetRoot + i) % 12);

                let anchorFret = -1;
                for (let f = 1; f <= 20; f++) {
                    if (getNoteValue(stringIdx, f) === bassNoteVal) {
                        anchorFret = f; break;
                    }
                }

                if (anchorFret !== -1) {
                    let minFret, maxFret;
                    if (shape === '1st') { minFret = anchorFret; maxFret = anchorFret + 4; }
                    else if (shape === '2nd') { minFret = anchorFret - 2; maxFret = anchorFret + 2; }
                    else if (shape === '4th') { minFret = anchorFret - 4; maxFret = anchorFret; }
                    else { minFret = anchorFret - 1; maxFret = anchorFret + 3; }

                    for(let s = stringIdx; s >= 0; s--) {
                        for(let f = minFret; f <= maxFret; f++) {
                            if (f >= 0 && f <= FRETS) {
                                let val = getNoteValue(s, f);
                                if (chordNotes.includes(val)) {
                                    if (s === stringIdx && f < anchorFret) continue; 
                                    activeNotes.push({
                                        s: s, fret: f, val: val,
                                        isRoot: (val === targetRoot),
                                        displayRoot: targetRoot,
                                        displayType: chordType
                                    });
                                }
                            }
                        }
                    }

                    activeNotes.sort((a,b) => {
                        let pitchA = (4 - a.s) * 5 + a.fret;
                        let pitchB = (4 - b.s) * 5 + b.fret;
                        return pitchA - pitchB;
                    });
                    
                    activeNotes = activeNotes.slice(0, intervals.length);
                }
            }
            return activeNotes;
            
        } else if (!['scale', 'parallel', 'chromatic', 'modes', 'modes_minor'].includes(exerciseMode)) {
            let pos = generatedPositions.find(p => p.id === anchorId);
            if (!pos) return [];
            return pos.notes.map(n => ({ s: n.s, fret: n.fret, val: n.val, isRoot: n.val === parseInt(currentRoot) }));
        } else {
            let activeNotes = [];
            let currentStringStart = anchorId; 
            let isOpenMode = (anchorId === 0);

            for (let s = 4; s >= 0; s--) {
                let stringBase = TUNING[s];
                let notesFoundOnString = [];
                let searchWidth = 5; 
                let minFret = isOpenMode ? 0 : Math.max(0, currentStringStart);
                let maxFret = Math.min(FRETS, minFret + searchWidth);

                for (let f = minFret; f <= maxFret; f++) {
                    let val = (stringBase + f) % 12;
                    if (scaleNotes.includes(val)) {
                        notesFoundOnString.push({ s: s, fret: f, val: val, isRoot: val === parseInt(currentRoot) });
                    }
                }
                let chosen = notesFoundOnString.slice(0, 3);
                chosen.forEach(n => activeNotes.push(n));
                if (chosen.length > 0) currentStringStart = isOpenMode ? 0 : chosen[0].fret;
            }
            return activeNotes;
        }
    }

    function syncFretboardState() {
        exerciseMode = exModeSel.value;
        const selectors = [scaleSel, strPairSel, strTriSel, strQuadSel, strQuinSel, chordSel, arpStrSel, arpInvSel, parallelSel, chromaticSel];
        selectors.forEach(el => { if(el) el.classList.add('hidden'); });

        if (exerciseMode === 'scale') {
            scaleSel.classList.remove('hidden'); currentScaleType = scaleSel.value;
        } else if (exerciseMode === 'arpeggio') {
            chordSel.classList.remove('hidden'); 
            arpStrSel.classList.remove('hidden');
            arpInvSel.classList.remove('hidden');
            currentScaleType = chordSel.value;
        } else if (exerciseMode === 'diatonic' || exerciseMode === 'diatonic_minor') {
            arpStrSel.classList.remove('hidden'); 
            currentScaleType = (exerciseMode === 'diatonic') ? 'major' : 'minor'; 
        } else if (exerciseMode === 'modes' || exerciseMode === 'modes_minor') {
            currentScaleType = (exerciseMode === 'modes') ? 'major' : 'minor'; 
        } else if (exerciseMode === 'parallel') {
            parallelSel.classList.remove('hidden');
            currentScaleType = 'major';
        } else if (exerciseMode === 'chromatic') {
            chromaticSel.classList.remove('hidden');
            currentScaleType = 'major';
        } else {
            currentScaleType = 'major';
            if (exerciseMode === 'pair_drill') strPairSel.classList.remove('hidden');
            if (exerciseMode === 'triplet_drill') strTriSel.classList.remove('hidden');
            if (exerciseMode === 'quad_drill') strQuadSel.classList.remove('hidden');
            if (exerciseMode === 'quint_drill') strQuinSel.classList.remove('hidden');
        }
        
        currentRoot = parseInt(keySel.value);
        if (exerciseMode === 'scale') {
            const scaleNotes = SCALES[currentScaleType].map(i => (parseInt(currentRoot) + i) % 12);
            generatedPositions = generateDynamicPositions(scaleNotes);
        } else if (exerciseMode === 'arpeggio') {
            generatedPositions = [
                { id: '1st', label: 'Shape 1', subLabel: '1st Finger' },
                { id: '2nd', label: 'Shape 2', subLabel: '2nd Finger' },
                { id: '4th', label: 'Shape 3', subLabel: '4th Finger' }
            ];
        } else if (exerciseMode === 'diatonic' || exerciseMode === 'diatonic_minor') {
            let chordList = (exerciseMode === 'diatonic') ? DIATONIC_CHORDS : MINOR_DIATONIC_CHORDS;
            generatedPositions = chordList.map((dc, idx) => ({
                id: `dia_${idx}`, label: dc.name, subLabel: dc.type
            }));
        } else if (exerciseMode === 'modes' || exerciseMode === 'modes_minor') {
            let isMajor = (exerciseMode === 'modes');
            let chordList = isMajor ? DIATONIC_CHORDS : MINOR_DIATONIC_CHORDS;
            let modeNames = SCALE_MODE_NAMES[isMajor ? 'major' : 'minor'];
            generatedPositions = chordList.map((dc, idx) => ({
                id: `mode_${idx}`, label: modeNames[idx], subLabel: `${dc.name} (${dc.type})`
            }));
        } else if (exerciseMode === 'parallel' || exerciseMode === 'chromatic') {
            generatedPositions = [{ id: 'all', label: '全指板探索', modeName: '' }];
        } else {
            let selMap = {'pair_drill':strPairSel, 'triplet_drill':strTriSel, 'quad_drill':strQuadSel, 'quint_drill':strQuinSel};
            selectedStrings = selMap[exerciseMode].value.split(',').map(Number);
            generatedPositions = generateSequenceDrillPositions();
        }
        
        const ignoreSingleMode = ['parallel', 'chromatic', 'modes', 'modes_minor'];
        if (!isFretboardMultiMode || activeAnchors.size === 0 || ignoreSingleMode.includes(exerciseMode)) {
            activeAnchors.clear();
            if(generatedPositions.length > 0) activeAnchors.add(generatedPositions[0].id);
        }
        renderFretboard();
    }

    function renderFretboard() {
        currentViewMode = viewModeSel.value;
        let scaleIntervals = (exerciseMode === 'scale' || exerciseMode === 'arpeggio') ? SCALES[currentScaleType] : SCALES['major'];
        if (exerciseMode === 'diatonic_minor' || exerciseMode === 'modes_minor') scaleIntervals = SCALES['minor'];
        
        const scaleNotes = scaleIntervals.map(i => (parseInt(currentRoot) + i) % 12);

        const btnContainer = document.getElementById('posBtnContainer');
        btnContainer.innerHTML = '';
        
        generatedPositions.forEach((pos, idx) => {
            let btn = document.createElement('button');
            btn.className = 'pos-btn';
            if (activeAnchors.has(pos.id)) btn.classList.add('active');
            let label = (exerciseMode === 'scale') ? ((pos.id === 0) ? "Open" : `Pos ${idx + 1}`) : pos.label;
            btn.innerHTML = `${label}<span class="mode-name">${pos.modeName || pos.subLabel}</span>`;
            btn.onclick = () => {
                const ignoreSingleMode = ['parallel', 'chromatic', 'modes', 'modes_minor'];
                if (isFretboardMultiMode && !ignoreSingleMode.includes(exerciseMode)) {
                    if (activeAnchors.has(pos.id)) activeAnchors.delete(pos.id);
                    else activeAnchors.add(pos.id);
                } else {
                    activeAnchors.clear(); activeAnchors.add(pos.id);
                }
                renderFretboard();
            };
            btnContainer.appendChild(btn);
        });

        drawSVG(scaleNotes);
    }

    function updateLegend() {
        const legend = document.getElementById('fretboardLegend');
        if (!legend) return;
        
        if (exerciseMode === 'parallel') {
            let pMode = document.getElementById('parallelModeSelect').value;
            if (pMode === 'overlay') {
                legend.innerHTML = `
                    <div class="legend-item"><span class="dot" style="background:var(--note-root)"></span>根音 (Root)</div>
                    <div class="legend-item"><span class="dot" style="background:var(--note-common)"></span>共同骨幹音 (1, 2, 4, 5)</div>
                    <div class="legend-item"><span class="dot" style="background:var(--note-major)"></span>大調色彩音 (3, 6, 7)</div>
                    <div class="legend-item"><span class="dot" style="background:var(--note-minor)"></span>小調色彩音 (b3, b6, b7)</div>
                `;
            } else {
                legend.innerHTML = `
                    <div class="legend-item"><span class="dot" style="background:var(--note-root)"></span>根音</div>
                    <div class="legend-item"><span class="dot" style="background:${pMode === 'maj' ? 'var(--note-major)' : 'var(--note-minor)'}"></span>音階組成音</div>
                `;
            }
        } else if (exerciseMode === 'chromatic') {
            let cMode = document.getElementById('chromaticFilterSelect').value;
            if (cMode === 'all') {
                legend.innerHTML = `
                    <div class="legend-item"><span class="dot" style="background:var(--note-root)"></span>根音</div>
                    <div class="legend-item"><span class="dot" style="background:var(--note-active)"></span>半音階 (All 12 Notes)</div>
                `;
            } else {
                legend.innerHTML = `
                    <div class="legend-item"><span class="dot" style="background:var(--note-root)"></span>根音</div>
                    <div class="legend-item"><span class="dot" style="background:var(--note-active)"></span>調內骨幹音</div>
                    <div class="legend-item"><span class="dot" style="background:var(--note-passing-bg); border:1px solid var(--note-passing-border)"></span>經過音 (Passing Tones)</div>
                `;
            }
        } else if (exerciseMode === 'modes' || exerciseMode === 'modes_minor') {
            legend.innerHTML = `
                <div class="legend-item"><span class="dot" style="background:var(--note-root)"></span>調式根音 (Mode Root)</div>
                <div class="legend-item"><span class="dot" style="background:var(--note-active)"></span>調式和弦音 (1, 3, 5, 7)</div>
                <div class="legend-item"><span class="dot" style="background:var(--note-ghost)"></span>調式延伸音 (2, 4, 6)</div>
            `;
        } else {
            legend.innerHTML = `
                <div class="legend-item"><span class="dot" style="background:var(--note-root)"></span>根音</div>
                <div class="legend-item"><span class="dot" style="background:var(--note-active)"></span>組成音</div>
                <div class="legend-item"><span class="dot" style="background:var(--note-extension)"></span>特徵音</div>
            `;
        }
    }

    function drawSVG(scaleNotes) {
        const svg = document.getElementById('fretboard');
        svg.innerHTML = '';

        for (let f = 0; f <= FRETS; f++) {
            let x = X_START + (f * FRET_WIDTH);
            let isNut = (f === 0);
            
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x); line.setAttribute("y1", Y_START);
            line.setAttribute("x2", x); line.setAttribute("y2", Y_START + 4 * STRING_GAP);
            line.setAttribute("stroke", isNut ? "var(--nut-line)" : "var(--fret-line)");
            line.setAttribute("stroke-width", isNut ? 5 : 2);
            svg.appendChild(line);

            if (f > 0) {
                let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
                txt.setAttribute("x", x - FRET_WIDTH/2); txt.setAttribute("y", Y_START - 10);
                txt.setAttribute("text-anchor", "middle"); txt.setAttribute("fill", "var(--text-sub)");
                txt.setAttribute("font-size", "12"); txt.textContent = f;
                svg.appendChild(txt);
            }

            let cx = x - FRET_WIDTH/2; let cy = Y_START + 2 * STRING_GAP;
            if ([3,5,7,9,15,17,19,21].includes(f)) drawInlay(svg, cx, cy, false);
            if ([12, 24].includes(f)) drawInlay(svg, cx, cy, true);
        }

        for (let s = 0; s < STRINGS; s++) {
            let y = Y_START + (s * STRING_GAP);
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", X_START); line.setAttribute("y1", y);
            line.setAttribute("x2", X_START + (FRETS * FRET_WIDTH)); line.setAttribute("y2", y);
            line.setAttribute("stroke", "var(--string-line)"); line.setAttribute("stroke-width", 1 + s * 0.5);
            svg.appendChild(line);
        }

        if (exerciseMode === 'parallel' || exerciseMode === 'chromatic') {
            for (let s = 0; s < STRINGS; s++) {
                for (let f = 0; f <= FRETS; f++) {
                    let val = getNoteValue(s, f);
                    drawNoteCircle(svg, s, f, val, true);
                }
            }
            updateLegend();
            return;
        }

        if (exerciseMode === 'modes' || exerciseMode === 'modes_minor') {
            let isMajor = (exerciseMode === 'modes');
            let activeModeId = activeAnchors.values().next().value || 'mode_0';
            let dIndex = parseInt(activeModeId.split('_')[1]);
            let dc = isMajor ? DIATONIC_CHORDS[dIndex] : MINOR_DIATONIC_CHORDS[dIndex];
            let modeRoot = (parseInt(currentRoot) + dc.interval) % 12;
            
            let modeScaleTypes = isMajor 
                ? ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian']
                : ['aeolian', 'locrian', 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian'];
            let currentModeScaleType = modeScaleTypes[dIndex];

            for (let s = 0; s < STRINGS; s++) {
                for (let f = 0; f <= FRETS; f++) {
                    let val = getNoteValue(s, f);
                    if (scaleNotes.includes(val)) {
                        drawNoteCircle(svg, s, f, val, true, modeRoot, currentModeScaleType);
                    }
                }
            }
            updateLegend();
            return;
        }

        if (['scale', 'arpeggio', 'diatonic', 'diatonic_minor'].includes(exerciseMode)) {
            for (let s = 0; s < STRINGS; s++) {
                for (let f = 0; f <= FRETS; f++) {
                    let val = getNoteValue(s, f);
                    if (scaleNotes.includes(val)) drawNoteCircle(svg, s, f, val, false);
                }
            }
        } else {
            selectedStrings.forEach(s => {
                for (let f = 0; f <= FRETS; f++) {
                    let val = getNoteValue(s, f);
                    if (scaleNotes.includes(val)) drawNoteCircle(svg, s, f, val, false);
                }
            });
        }

        let mergedActiveNotes = new Map();
        activeAnchors.forEach(anchorId => {
            getNotesForAnchor(anchorId, scaleNotes).forEach(n => {
                let key = `${n.s}-${n.fret}`;
                if (!mergedActiveNotes.has(key) || n.isRoot) mergedActiveNotes.set(key, n);
            });
        });

        mergedActiveNotes.forEach(n => { 
            if (n.fret <= FRETS) {
                drawNoteCircle(svg, n.s, n.fret, n.val, true, n.displayRoot, n.displayType); 
            } 
        });
        updateLegend();
    }

    function drawInlay(svg, cx, cy, isDouble) {
        if (isDouble) {
            createCircle(svg, cx, cy - 15, 5, "var(--inlay)"); createCircle(svg, cx, cy + 15, 5, "var(--inlay)");
        } else {
            createCircle(svg, cx, cy, 5, "var(--inlay)");
        }
    }

    function createCircle(svg, cx, cy, r, fill) {
        let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", r); c.setAttribute("fill", fill);
        svg.appendChild(c);
    }

    function drawNoteCircle(svg, s, f, val, isActive, customRoot = null, customType = null) {
        let cx = X_START + (f * FRET_WIDTH) - (FRET_WIDTH/2);
        if (f === 0) cx = X_START - 20;

        let cy = Y_START + (s * STRING_GAP);
        
        let effectiveRoot = customRoot !== null ? customRoot : parseInt(currentRoot);
        let isRoot = (val === effectiveRoot);
        let intervalLabel = getIntervalLabel(val, customRoot, customType);
        let rootOffset = (val - effectiveRoot + 12) % 12;

        let color = "var(--note-active)";
        let strokeColor = "var(--bg-app)";
        let strokeWidth = 2;
        let radius = isActive ? 14 : 8;
        let isPassing = false;
        let textFill = isActive ? "var(--note-text-active)" : "var(--note-text-ghost)";
        let shouldDraw = true;

        if (exerciseMode === 'parallel') {
            let pMode = document.getElementById('parallelModeSelect').value;
            let isMajTone = SCALES['major'].includes(rootOffset);
            let isMinTone = SCALES['minor'].includes(rootOffset);
            
            radius = 14; isActive = true;

            if (pMode === 'overlay') {
                if (!isMajTone && !isMinTone) shouldDraw = false;
                if (isRoot) { color = "var(--note-root)"; }
                else if (isMajTone && isMinTone) { color = "var(--note-common)"; }
                else if (isMajTone) { color = "var(--note-major)"; }
                else if (isMinTone) { color = "var(--note-minor)"; textFill = "#ffffff"; }
            } else if (pMode === 'maj') {
                if (!isMajTone) shouldDraw = false;
                color = isRoot ? "var(--note-root)" : "var(--note-major)";
            } else if (pMode === 'min') {
                if (!isMinTone) shouldDraw = false;
                color = isRoot ? "var(--note-root)" : "var(--note-minor)";
            }
        } else if (exerciseMode === 'chromatic') {
            let cMode = document.getElementById('chromaticFilterSelect').value;
            radius = 14; isActive = true;
            
            let isMajTone = SCALES['major'].includes(rootOffset);
            let isMinTone = SCALES['minor'].includes(rootOffset);
            
            if (isRoot) {
                color = "var(--note-root)";
            } else if (cMode === 'maj_pass') {
                if (isMajTone) color = "var(--note-active)";
                else isPassing = true;
            } else if (cMode === 'min_pass') {
                if (isMinTone) color = "var(--note-active)";
                else isPassing = true;
            } else {
                color = "var(--note-active)";
            }
            
            if (isPassing) {
                color = "var(--note-passing-bg)";
                strokeColor = "var(--note-passing-border)";
                strokeWidth = 2;
                textFill = "var(--note-passing-text)";
                radius = 12;
            }
        } else if (exerciseMode === 'modes' || exerciseMode === 'modes_minor') {
            radius = 14; 
            isActive = true;
            let offset = (val - effectiveRoot + 12) % 12;
            let modeIntervals = SCALES[customType];
            let chordToneIndex = modeIntervals.indexOf(offset);
            
            let isChordTone = [0, 2, 4, 6].includes(chordToneIndex);
            
            if (isRoot) {
                color = "var(--note-root)";
            } else if (isChordTone) {
                color = "var(--note-active)"; 
            } else {
                color = "var(--note-ghost)";  
                strokeColor = "transparent";
                isActive = false; 
                textFill = "var(--note-text-ghost)";
                radius = 12;
            }
        } else {
            let isExtension = ['9', '11', '#11', '13', 'b9', '#9', 'b13', 'b5', '#5', 'bb7'].includes(intervalLabel);
            color = isRoot ? "var(--note-root)" : (isExtension ? "var(--note-extension)" : "var(--note-active)");
            if (!isActive) {
                color = "var(--note-ghost)";
                strokeColor = "transparent";
            }
        }

        if (!shouldDraw) return;

        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx); circle.setAttribute("cy", cy);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", color); 
        circle.setAttribute("stroke", strokeColor); 
        circle.setAttribute("stroke-width", strokeWidth);
        
        let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.appendChild(circle);

        if (isActive || f === 0) {
            let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txt.setAttribute("x", cx); txt.setAttribute("y", cy + 1);
            txt.setAttribute("dominant-baseline", "central"); txt.setAttribute("text-anchor", "middle");
            txt.setAttribute("class", "note-text");
            txt.setAttribute("fill", textFill);
            
            let labelText = "";
            let masterKey = parseInt(currentRoot);
            if (currentViewMode === 'notes') labelText = getNoteName(val, intervalLabel, masterKey);
            else if (currentViewMode === 'solfege') labelText = getSolfegeLabel(val);
            else labelText = CN_INTERVAL_MAP[intervalLabel] || intervalLabel || "?";
            
            txt.textContent = labelText; g.appendChild(txt);
        }
        svg.appendChild(g);
    }

    // Fretboard Zoom 
    const zoomContainer = document.getElementById('zoomContainer');
    const svgElement = document.getElementById('fretboard');
    let viewBox = { x: 0, y: 0, w: BASE_W, h: BASE_H };
    const MAX_W = BASE_W; const MIN_W = BASE_W / 4; 
    
    function setViewBox() {
        if (viewBox.w > MAX_W) viewBox.w = MAX_W;
        if (viewBox.w < MIN_W) viewBox.w = MIN_W;
        viewBox.h = viewBox.w * (BASE_H / BASE_W);
        if (viewBox.x < 0) viewBox.x = 0;
        if (viewBox.y < 0) viewBox.y = 0;
        if (viewBox.x + viewBox.w > BASE_W) viewBox.x = BASE_W - viewBox.w;
        if (viewBox.y + viewBox.h > BASE_H) viewBox.y = BASE_H - viewBox.h;
        svgElement.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }

    let isPanning = false, startX = 0, startY = 0, initialPinchDist = 0, initialViewBoxW = 0, lastTapTime = 0;

    zoomContainer.addEventListener('mousedown', e => { isPanning = true; startX = e.clientX; startY = e.clientY; zoomContainer.style.cursor = 'grabbing'; });
    zoomContainer.addEventListener('mousemove', e => {
        if (!isPanning) return; e.preventDefault();
        const ratio = viewBox.w / zoomContainer.clientWidth;
        viewBox.x -= (e.clientX - startX) * ratio; viewBox.y -= (e.clientY - startY) * ratio;
        startX = e.clientX; startY = e.clientY; setViewBox();
    });
    zoomContainer.addEventListener('mouseup', () => { isPanning = false; zoomContainer.style.cursor = 'grab'; });
    zoomContainer.addEventListener('mouseleave', () => { isPanning = false; zoomContainer.style.cursor = 'grab'; });

    zoomContainer.addEventListener('wheel', e => {
        e.preventDefault();
        const dir = e.deltaY > 0 ? 1 : -1; 
        const oldW = viewBox.w; viewBox.w *= (1 + dir * 0.1);
        if (viewBox.w < MIN_W) viewBox.w = MIN_W; if (viewBox.w > MAX_W) viewBox.w = MAX_W;
        const rect = zoomContainer.getBoundingClientRect(); const offsetX = e.clientX - rect.left; 
        viewBox.x = (viewBox.x + offsetX * (oldW / rect.width)) - offsetX * (viewBox.w / rect.width);
        setViewBox();
    }, { passive: false });

    document.getElementById('resetZoomBtn').addEventListener('click', () => { viewBox = { x: 0, y: 0, w: BASE_W, h: BASE_H }; setViewBox(); });

    function getTouchDistance(touches) { return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY); }
    zoomContainer.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
            isPanning = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY;
            const currentTime = new Date().getTime(); const tapLength = currentTime - lastTapTime;
            if (tapLength < 300 && tapLength > 0) { viewBox = { x: 0, y: 0, w: BASE_W, h: BASE_H }; setViewBox(); e.preventDefault(); }
            lastTapTime = currentTime;
        } else if (e.touches.length === 2) {
            isPanning = false; initialPinchDist = getTouchDistance(e.touches); initialViewBoxW = viewBox.w;
        }
    }, { passive: false });
    zoomContainer.addEventListener('touchmove', e => {
        e.preventDefault(); 
        if (e.touches.length === 1 && isPanning) {
            const ratio = viewBox.w / zoomContainer.clientWidth;
            viewBox.x -= (e.touches[0].clientX - startX) * ratio; viewBox.y -= (e.touches[0].clientY - startY) * ratio;
            startX = e.touches[0].clientX; startY = e.touches[0].clientY; setViewBox();
        } else if (e.touches.length === 2) {
            const currentDist = getTouchDistance(e.touches);
            if (initialPinchDist > 0) {
                const scale = initialPinchDist / currentDist; const oldW = viewBox.w; viewBox.w = initialViewBoxW * scale;
                if (viewBox.w < MIN_W) viewBox.w = MIN_W; if (viewBox.w > MAX_W) viewBox.w = MAX_W;
                viewBox.x += (oldW - viewBox.w) / 2; viewBox.y += (oldW * (BASE_H / BASE_W) - viewBox.w * (BASE_H / BASE_W)) / 2;
                setViewBox();
            }
        }
    }, { passive: false });
    zoomContainer.addEventListener('touchend', e => {
        if (e.touches.length < 2) initialPinchDist = 0;
        if (e.touches.length === 0) isPanning = false;
        else if (e.touches.length === 1) { startX = e.touches[0].clientX; startY = e.touches[0].clientY; isPanning = true; }
    });

    document.addEventListener('touchmove', function(e) { if (e.touches.length > 1 && !e.target.closest('#zoomContainer')) e.preventDefault(); }, { passive: false });

    exModeSel.addEventListener('change', syncFretboardState);
    
    [keySel, scaleSel, chordSel, arpStrSel, arpInvSel, strPairSel, strTriSel, strQuadSel, strQuinSel, parallelSel, chromaticSel].forEach(el => {
        if(el) el.addEventListener('change', syncFretboardState);
    });
    viewModeSel.addEventListener('change', renderFretboard);
    multiCheck.addEventListener('change', (e) => {
        isFretboardMultiMode = e.target.checked;
        const ignoreSingleMode = ['parallel', 'chromatic', 'modes', 'modes_minor'];
        if (!isFretboardMultiMode && activeAnchors.size > 1 && !ignoreSingleMode.includes(exerciseMode)) {
            const first = activeAnchors.values().next().value; activeAnchors.clear(); activeAnchors.add(first);
        }
        renderFretboard();
    });

    /* =========================================================
       MODULE 2: CHORD TONE TRAINER LOGIC
    ========================================================= */
    const TRAINER_CHORDS = {
        'maj7': { intervals: [4, 7, 11], labels: ['3', '5', '7'] },
        'min7': { intervals: [3, 7, 10], labels: ['b3', '5', 'b7'] },
        'dom7': { intervals: [4, 7, 10], labels: ['3', '5', 'b7'] },
        'm7b5': { intervals: [3, 6, 10], labels: ['b3', 'b5', 'b7'] },
        'aug7': { intervals: [4, 8, 10], labels: ['3', '#5', 'b7'] },
        'dim7': { intervals: [3, 6, 9],  labels: ['b3', 'b5', 'bb7'] }
    };

    const KEYBOARD_LAYOUT = [
        { label: 'C', val: 0 }, { label: 'C#', val: 1 }, { label: 'D', val: 2 }, { label: 'D#', val: 3 }, 
        { label: 'E', val: 4 }, { label: 'F', val: 5 }, { label: 'F#', val: 6 }, { label: 'G', val: 7 }, 
        { label: 'G#', val: 8 }, { label: 'A', val: 9 }, { label: 'A#', val: 10 }, { label: 'B', val: 11 },
        { label: 'Db', val: 1 }, { label: 'Eb', val: 3 }, { label: 'Gb', val: 6 }, { label: 'Ab', val: 8 }, 
        { label: 'Bb', val: 10 }, { label: 'Bbb', val: 9 } 
    ];

    let tRoot = 0; 
    let tChord = 'maj7';
    let tInversion = 0; 
    let tAnswers = [null, null, null]; 
    let activeBoxIdx = null;

    const elDisplayRoot = document.getElementById('displayRootName');
    const elTypeSel = document.getElementById('trainerChordType');
    const elInvSel = document.getElementById('trainerInversion'); 
    const elSeqSel = document.getElementById('trainerSeqMode');
    const elAccToggle = document.getElementById('trainerAccidentalToggle');
    const elTipsToggle = document.getElementById('trainerTipsToggle');
    const elKeyboard = document.getElementById('trainerKeyboard');
    const boxes = [
        document.getElementById('box1'),
        document.getElementById('box2'),
        document.getElementById('box3')
    ];
    const boxLabels = [
        document.getElementById('lblBox1'),
        document.getElementById('lblBox2'),
        document.getElementById('lblBox3')
    ];
    const elLblBox0 = document.getElementById('lblBox0');

    function autoSetAccidental(rootVal) {
        const PREFERS_SHARP = [2, 4, 7, 9, 11]; 
        elAccToggle.checked = PREFERS_SHARP.includes(rootVal); 
        renderTrainerKeyboard();
    }

    function initTrainer() {
        autoSetAccidental(tRoot);
        resetTrainerRound();
    }

    function renderTrainerKeyboard() {
        elKeyboard.innerHTML = '';
        const isFlat = !elAccToggle.checked; 
        
        KEYBOARD_LAYOUT.forEach(key => {
            if (isFlat && key.label.includes('#')) return;
            if (!isFlat && key.label.includes('b') && key.label !== 'Bbb') return;
            
            const btn = document.createElement('button');
            btn.className = 'key-btn';
            btn.innerText = key.label;
            btn.onclick = () => handleKeyClick(key.label, key.val);
            elKeyboard.appendChild(btn);
        });
    }

    function resetTrainerRound() {
        const isFlat = !elAccToggle.checked; 
        elDisplayRoot.innerText = isFlat ? NOTES_FLAT[tRoot] : NOTES_SHARP[tRoot];
        
        tAnswers = [null, null, null];
        const chordDef = TRAINER_CHORDS[tChord];
        
        const fullIntervals = [0, ...chordDef.intervals];
        const fullLabels = ['R', ...chordDef.labels];

        const rotIntervals = [...fullIntervals.slice(tInversion), ...fullIntervals.slice(0, tInversion)];
        const rotLabels = [...fullLabels.slice(tInversion), ...fullLabels.slice(0, tInversion)];

        const bassVal = (tRoot + rotIntervals[0]) % 12;
        document.getElementById('box0').innerText = isFlat ? NOTES_FLAT[bassVal] : NOTES_SHARP[bassVal];
        elLblBox0.innerText = rotLabels[0];

        boxes.forEach((box, i) => {
            box.querySelector('.val').innerText = '?';
            box.querySelector('.hint-text').innerText = '';
            box.className = 'tone-box input-box';
            
            boxLabels[i].innerText = rotLabels[i + 1]; 
            box.dataset.expectedInterval = rotIntervals[i + 1]; 
        });
        
        setActiveBox(1);
    }

    function setActiveBox(idx) {
        activeBoxIdx = idx;
        boxes.forEach((box, i) => {
            if ((i + 1) === idx) box.classList.add('active');
            else box.classList.remove('active');
        });
    }

    function handleKeyClick(label, val) {
        if (!activeBoxIdx) return;
        const boxIndex = activeBoxIdx - 1;
        tAnswers[boxIndex] = val;
        boxes[boxIndex].querySelector('.val').innerText = label;
        boxes[boxIndex].classList.remove('error', 'success', 'show-hint');
        
        if (activeBoxIdx < 3) setActiveBox(activeBoxIdx + 1);
        else setActiveBox(1);
    }

    function getExpectedNoteName(rootVal, intervalSteps) {
        const isFlat = !elAccToggle.checked;
        const targetVal = (rootVal + intervalSteps) % 12;
        if (tChord === 'dim7' && intervalSteps === 9) return 'Bbb/A'; 
        return isFlat ? NOTES_FLAT[targetVal] : NOTES_SHARP[targetVal];
    }

    function validateTrainer() {
        let allCorrect = true;
        let tipsOn = elTipsToggle.checked;

        boxes.forEach((box, i) => {
            const expectedInterval = parseInt(box.dataset.expectedInterval);
            const expectedVal = (tRoot + expectedInterval) % 12;
            const userVal = tAnswers[i];
            
            box.classList.remove('active', 'error', 'success', 'show-hint');

            if (userVal === null) {
                allCorrect = false;
                box.classList.add('error');
            } else if (userVal !== expectedVal) {
                allCorrect = false;
                box.classList.add('error');
                if (tipsOn) {
                    box.querySelector('.hint-text').innerText = getExpectedNoteName(tRoot, expectedInterval);
                    box.classList.add('show-hint');
                }
            } else {
                box.classList.add('success');
            }
        });

        if (allCorrect) {
            mapTrainerToFretboard(tRoot, tChord);
            setTimeout(() => {
                advanceTrainerRoot();
                resetTrainerRound();
            }, 1200);
        }
    }

    function advanceTrainerRoot() {
        const seq = elSeqSel.value;
        if (seq === 'chromatic') {
            tRoot = (tRoot + 1) % 12;
            autoSetAccidental(tRoot);
        } else if (seq === 'circle5ths') {
            tRoot = (tRoot + 7) % 12; 
            autoSetAccidental(tRoot);
        } else if (seq === 'diatonic') {
            if (typeof window.diatonicIdx === 'undefined') window.diatonicIdx = 0;
            window.diatonicIdx = (window.diatonicIdx + 1) % 7;
            let dc = DIATONIC_CHORDS[window.diatonicIdx];
            let masterKey = parseInt(document.getElementById('keySelect').value);
            tRoot = (masterKey + dc.interval) % 12;
            tChord = dc.type;
            document.getElementById('trainerChordType').value = tChord;
            autoSetAccidental(masterKey);
        } else {
            let next = tRoot;
            while(next === tRoot) next = Math.floor(Math.random() * 12);
            tRoot = next;
            autoSetAccidental(tRoot);
        }
    }

    function mapTrainerToFretboard(rootVal, chordType) {
        exModeSel.value = 'arpeggio';
        keySel.value = rootVal;
        chordSel.value = chordType;
        
        arpInvSel.value = tInversion; 
        
        viewModeSel.value = 'intervals'; 
        syncFretboardState();
        document.querySelector('.app-container').scrollIntoView({ behavior: 'smooth' });
    }

    elTypeSel.addEventListener('change', e => { tChord = e.target.value; resetTrainerRound(); });
    elInvSel.addEventListener('change', e => { tInversion = parseInt(e.target.value); resetTrainerRound(); });
    elAccToggle.addEventListener('change', () => { renderTrainerKeyboard(); resetTrainerRound(); });
    
    elSeqSel.addEventListener('change', e => { 
        if (e.target.value === 'diatonic') {
            window.diatonicIdx = 0;
            let dc = DIATONIC_CHORDS[0];
            let masterKey = parseInt(document.getElementById('keySelect').value);
            tRoot = (masterKey + dc.interval) % 12;
            tChord = dc.type;
            document.getElementById('trainerChordType').value = tChord;
            autoSetAccidental(masterKey);
        } else {
            autoSetAccidental(tRoot);
        }
        resetTrainerRound(); 
    });

    document.getElementById('btnPrevRoot').addEventListener('click', () => {
        tRoot = (tRoot - 1 + 12) % 12; 
        autoSetAccidental(tRoot);
        resetTrainerRound();
    });
    document.getElementById('btnNextRoot').addEventListener('click', () => {
        tRoot = (tRoot + 1) % 12; 
        autoSetAccidental(tRoot);
        resetTrainerRound();
    });

    boxes.forEach(box => {
        box.addEventListener('click', () => setActiveBox(parseInt(box.getAttribute('data-idx'))));
    });

    document.getElementById('btnTrainerSubmit').addEventListener('click', validateTrainer);
    initTrainer();


    /* =========================================================
       MODULE 3: RHYTHM GENERATOR LOGIC
    ========================================================= */
    let audioCtx, isPlaying = false, bpm = 100, kickVolume = 0.8, clapVolume = 0.8, shuffleProb = 0, kickEnabled = true;
    let timerID, nextBeatTime = 0, currentBeatIndex = 0, beatsPerBar = 4, currentMeterMode = 'simple', activePatternIDs = [], currentMeasure = [];

    const displayArea = document.getElementById('displayArea');
    const libraryGrid = document.getElementById('libraryGrid');
    const libTitle = document.getElementById('libTitle');
    const playBtn = document.getElementById('playBtn');

    function syncRhythmUI() {
        const val = document.getElementById('timeSigSelect').value;
        const [num, den] = val.split('/').map(Number);
        if (den === 8 && num % 3 === 0) { currentMeterMode = 'compound'; beatsPerBar = num / 3; } 
        else { currentMeterMode = 'simple'; beatsPerBar = num; }
        libTitle.innerText = `Library (${val})`;
        renderLibrary(); generateRhythm();
    }

    function renderLibrary() {
        libraryGrid.innerHTML = '';
        if (!window.ALL_PATTERNS) return;
        const patternsToShow = window.ALL_PATTERNS.filter(p => p.type === currentMeterMode);
        activePatternIDs = patternsToShow.map(p => p.id); 
        patternsToShow.forEach(p => {
            const div = document.createElement('div'); div.className = 'pattern-item selected'; div.innerHTML = p.svg; div.title = p.name;
            div.onclick = () => { div.classList.toggle('selected'); if (activePatternIDs.includes(p.id)) activePatternIDs = activePatternIDs.filter(id => id !== p.id); else activePatternIDs.push(p.id); };
            libraryGrid.appendChild(div);
        });
    }

    function generateRhythm() {
        if (activePatternIDs.length === 0) return;
        currentMeasure = []; displayArea.innerHTML = '';
        for (let i = 0; i < beatsPerBar; i++) {
            const randId = activePatternIDs[Math.floor(Math.random() * activePatternIDs.length)];
            const patternObj = window.ALL_PATTERNS.find(p => p.id === randId);
            if (patternObj) {
                currentMeasure.push(patternObj);
                const card = document.createElement('div'); card.className = 'beat-card'; card.innerHTML = `<div class="svg-container">${patternObj.svg}</div>`;
                displayArea.appendChild(card);
            }
        }
    }

    function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); }

    function playSound(time, type) {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        if (type === 'kick') {
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(150, time); osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
            gain.gain.setValueAtTime(kickVolume, time); gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            osc.start(time); osc.stop(time + 0.5);
        } else {
            const bufferSize = audioCtx.sampleRate * 2; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1; 
            const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
            const filter = audioCtx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 1200; filter.Q.value = 1; 
            const clapGain = audioCtx.createGain(); clapGain.gain.setValueAtTime(clapVolume, time); clapGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15); 
            noise.connect(filter); filter.connect(clapGain); clapGain.connect(audioCtx.destination);
            noise.start(time); noise.stop(time + 0.2);
        }
    }

    function scheduler() {
        while (nextBeatTime < audioCtx.currentTime + 0.1) {
            const beatDuration = 60.0 / bpm; const currentIdx = currentBeatIndex; const visualDelay = (nextBeatTime - audioCtx.currentTime) * 1000;
            setTimeout(() => { document.querySelectorAll('.beat-card').forEach((c, i) => { if (i === currentIdx) c.classList.add('active'); else c.classList.remove('active'); }); }, Math.max(0, visualDelay));
            if (kickEnabled) playSound(nextBeatTime, 'kick');
            const pattern = currentMeasure[currentBeatIndex];
            if (pattern && pattern.events) pattern.events.forEach(ratio => playSound(nextBeatTime + (ratio * beatDuration), 'clap'));
            nextBeatTime += beatDuration; currentBeatIndex++;

            if (currentBeatIndex >= beatsPerBar) {
                currentBeatIndex = 0;
                if (shuffleProb > 0 && activePatternIDs.length > 0) {
                    setTimeout(() => {
                        for (let i = 0; i < beatsPerBar; i++) {
                            if (Math.random() * 100 < shuffleProb) {
                                const newPattern = window.ALL_PATTERNS.find(p => p.id === activePatternIDs[Math.floor(Math.random() * activePatternIDs.length)]);
                                if (newPattern) { currentMeasure[i] = newPattern; const card = displayArea.children[i]; if (card) { card.innerHTML = `<div class="svg-container">${newPattern.svg}</div>`; card.classList.remove('changing'); void card.offsetWidth; card.classList.add('changing'); } }
                            }
                        }
                    }, Math.max(0, visualDelay + beatDuration * 800));
                }
            }
        }
        if (isPlaying) timerID = requestAnimationFrame(scheduler);
    }

    document.getElementById('timeSigSelect').addEventListener('change', syncRhythmUI);
    document.getElementById('bpmSlider').addEventListener('input', e => { bpm = parseInt(e.target.value); document.getElementById('bpmDisplay').innerText = bpm; });
    document.getElementById('kickVolSlider').addEventListener('input', e => { kickVolume = parseInt(e.target.value) / 100; });
    document.getElementById('clapVolSlider').addEventListener('input', e => { clapVolume = parseInt(e.target.value) / 100; });
    document.getElementById('shuffleSlider').addEventListener('input', e => { shuffleProb = parseInt(e.target.value); document.getElementById('shuffleDisplay').innerText = shuffleProb + "%"; });
    document.getElementById('kickBtn').addEventListener('click', e => { kickEnabled = !kickEnabled; e.currentTarget.classList.toggle('active'); });
    document.getElementById('randomRhythmBtn').addEventListener('click', generateRhythm);
    
    playBtn.addEventListener('click', e => {
        if (isPlaying) { isPlaying = false; playBtn.classList.remove('playing'); playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'; document.querySelectorAll('.beat-card').forEach(c => c.classList.remove('active')); } 
        else { initAudio(); isPlaying = true; playBtn.classList.add('playing'); playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'; currentBeatIndex = 0; nextBeatTime = audioCtx.currentTime + 0.1; scheduler(); }
    });

    document.getElementById('toggleLibBtn').addEventListener('click', () => { const grid = document.getElementById('libraryGrid'); grid.classList.toggle('collapsed'); document.getElementById('toggleLibBtn').innerText = grid.classList.contains('collapsed') ? '▶' : '▼'; });
    document.getElementById('selectAllBtn').addEventListener('click', () => { activePatternIDs = window.ALL_PATTERNS.filter(p => p.type === currentMeterMode).map(p => p.id); document.querySelectorAll('.pattern-item').forEach(el => el.classList.add('selected')); });
    document.getElementById('deselectAllBtn').addEventListener('click', () => { activePatternIDs = []; document.querySelectorAll('.pattern-item').forEach(el => el.classList.remove('selected')); });

    /* =========================================================
       INITIALIZATION
    ========================================================= */
    syncFretboardState();
    syncRhythmUI();
});