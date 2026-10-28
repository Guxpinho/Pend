(function() {
    // ---------- AUDIO ENGINE ----------
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // master gain
    const masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(audioCtx.destination);

    // crossfader: will be set per deck
    let crossValue = 0.5;

    // deck state
    class Deck {
      constructor(id) {
        this.id = id;
        this.audioBuffer = null;
        this.source = null;
        this.gainNode = audioCtx.createGain();
        this.gainNode.gain.value = 0.8;
        this.eqHigh = audioCtx.createBiquadFilter(); this.eqHigh.type = 'highshelf'; this.eqHigh.frequency.value = 3000;
        this.eqMid = audioCtx.createBiquadFilter(); this.eqMid.type = 'peaking'; this.eqMid.frequency.value = 800; this.eqMid.Q.value = 1;
        this.eqLow = audioCtx.createBiquadFilter(); this.eqLow.type = 'lowshelf'; this.eqLow.frequency.value = 300;
        this.volume = 0.8;
        this.gainValue = 1.0;
        this.isPlaying = false;
        this.startOffset = 0;
        this.startTime = 0;
        this.tempo = 1.0;
        this.loopActive = false;
        this.loopStart = 0;
        this.loopEnd = 4;
        this.hotCues = [null, null, null, null];
        this.cuePoint = 0;
        this.trackDuration = 0;
        this.currentTime = 0;
        this.bpm = 0;
        this.waveformData = null;
        this.rafId = null;

        // connect chain: source -> gain -> eqs -> deckGain -> cross
        this.deckGain = audioCtx.createGain();
        this.deckGain.gain.value = 1.0;
        this.gainNode.connect(this.eqLow);
        this.eqLow.connect(this.eqMid);
        this.eqMid.connect(this.eqHigh);
        this.eqHigh.connect(this.deckGain);
        // cross gain (will be set by crossfader)
        this.crossGain = audioCtx.createGain();
        this.crossGain.gain.value = 0.5;
        this.deckGain.connect(this.crossGain);
        this.crossGain.connect(masterGain);
        // default eq values
        this.eqHigh.gain.value = 0;
        this.eqMid.gain.value = 0;
        this.eqLow.gain.value = 0;
        // ui refs
        this.ui = {
          playBtn: document.getElementById(`play${id}`),
          cueBtn: document.getElementById(`cue${id}`),
          title: document.getElementById(`trackTitle${id}`),
          artist: document.getElementById(`trackArtist${id}`),
          duration: document.getElementById(`timeDuration${id}`),
          current: document.getElementById(`timeCurrent${id}`),
          bpm: document.getElementById(`bpm${id}`),
          tempoSlider: document.getElementById(`tempo${id}`),
          tempoDisplay: document.getElementById(`tempoDisplay${id}`),
          jog: document.getElementById(`jog${id}`),
          waveformCanvas: document.getElementById(`waveform${id}`),
          playhead: document.getElementById(`playhead${id}`),
          volSlider: document.getElementById(`vol${id}`),
          hotcueBtns: document.querySelectorAll(`#deck${id} .btn-hotcue`),
          loopToggle: document.getElementById(`loopToggle${id}`),
          loopLen: document.getElementById(`loopLen${id}`),
          resetTempo: document.getElementById(`resetTempo${id}`),
          eqHigh: document.querySelector(`#eq${id} input[data-eq="high"]`),
          eqMid: document.querySelector(`#eq${id} input[data-eq="mid"]`),
          eqLow: document.querySelector(`#eq${id} input[data-eq="low"]`),
        };
        this.setupUI();
      }

      setupUI() {
        const u = this.ui;
        u.playBtn.addEventListener('click', () => this.togglePlay());
        u.cueBtn.addEventListener('click', () => this.goToCue());
        u.tempoSlider.addEventListener('input', (e) => { this.setTempo(parseFloat(e.target.value)); });
        u.resetTempo.addEventListener('click', () => { u.tempoSlider.value = 0; this.setTempo(0); });
        u.volSlider.addEventListener('input', (e) => { this.volume = parseFloat(e.target.value)/100; this.updateGain(); });
        u.loopToggle.addEventListener('click', () => { this.toggleLoop(); });
        u.hotcueBtns.forEach((btn, i) => { btn.addEventListener('click', () => this.handleHotcue(i)); });
        // eq
        u.eqHigh.addEventListener('input', (e) => { this.eqHigh.gain.value = parseFloat(e.target.value); });
        u.eqMid.addEventListener('input', (e) => { this.eqMid.gain.value = parseFloat(e.target.value); });
        u.eqLow.addEventListener('input', (e) => { this.eqLow.gain.value = parseFloat(e.target.value); });
        // waveform seek
        const container = document.getElementById(`waveformContainer${this.id}`);
        container.addEventListener('click', (e) => {
          if (!this.audioBuffer) return;
          const rect = container.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const seekTime = x * this.audioBuffer.duration;
          this.seek(seekTime);
        });
        // crossfader from mixer
        document.getElementById('crossfader').addEventListener('input', (e) => {
          crossValue = parseFloat(e.target.value)/100;
          this.updateCrossfade();
        });
        // master volume
        document.getElementById('masterVol').addEventListener('input', (e) => {
          masterGain.gain.value = parseFloat(e.target.value)/100;
        });
        // mixer eq/gain
        document.querySelectorAll('[data-mixer]').forEach(el => {
          el.addEventListener('input', (e) => {
            const deckId = el.dataset.mixer;
            const eqType = el.dataset.eq;
            const val = parseFloat(el.value);
            if (deckId === 'A') { 
              window.deckA[eqType === 'high' ? 'eqHigh' : eqType === 'mid' ? 'eqMid' : 'eqLow'].gain.value = val; 
            } else { 
              window.deckB[eqType === 'high' ? 'eqHigh' : eqType === 'mid' ? 'eqMid' : 'eqLow'].gain.value = val; 
            }
          });
        });
        document.getElementById('gainA').addEventListener('input', (e) => { 
          window.deckA.gainValue = parseFloat(e.target.value)/100; 
          window.deckA.updateGain(); 
        });
        document.getElementById('gainB').addEventListener('input', (e) => { 
          window.deckB.gainValue = parseFloat(e.target.value)/100; 
          window.deckB.updateGain(); 
        });
      }

      toggleLoop() {
        this.loopActive = !this.loopActive;
        this.ui.loopToggle.textContent = this.loopActive ? '⟳ ON' : '⟳ OFF';
        this.ui.loopToggle.classList.toggle('active', this.loopActive);
        
        // If playing, restart with loop settings
        if (this.isPlaying && this.audioBuffer) {
          const wasPlaying = this.isPlaying;
          const currentTime = this.currentTime;
          this.stopPlayback();
          this.currentTime = currentTime;
          if (wasPlaying) {
            this.play();
          }
        }
      }

      updateCrossfade() {
        const val = crossValue;
        const gainA = 1 - val;
        const gainB = val;
        if (this.id === 'A') this.crossGain.gain.value = gainA * this.volume * this.gainValue;
        else this.crossGain.gain.value = gainB * this.volume * this.gainValue;
      }

      updateGain() {
        this.updateCrossfade();
      }

      loadBuffer(buffer) {
        this.audioBuffer = buffer;
        this.trackDuration = buffer.duration;
        this.ui.duration.textContent = this.formatTime(buffer.duration);
        this.ui.title.textContent = 'Track loaded';
        this.ui.artist.textContent = '';
        this.ui.bpm.textContent = '-- BPM';
        this.generateWaveform(buffer);
        this.stopPlayback();
        this.currentTime = 0;
        this.ui.current.textContent = '00:00';
        this.ui.playhead.style.left = '0%';
        this.cuePoint = 0;
        this.hotCues = [null, null, null, null];
        this.ui.hotcueBtns.forEach(b => { b.classList.remove('stored','active'); b.textContent = b.textContent; });
        // Reset loop state
        this.loopActive = false;
        this.ui.loopToggle.textContent = '⟳ OFF';
        this.ui.loopToggle.classList.remove('active');
      }

      generateWaveform(buffer) {
        const canvas = this.ui.waveformCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        canvas.style.width = canvas.offsetWidth + 'px';
        canvas.style.height = canvas.offsetHeight + 'px';
        const data = buffer.getChannelData(0);
        const samples = data.length;
        const step = Math.floor(samples / canvas.width);
        const amp = 0.9;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a1f16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#32ff7a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < canvas.width; i++) {
          let min = 1, max = -1;
          for (let j = 0; j < step; j++) {
            const idx = i * step + j;
            if (idx < samples) {
              const v = data[idx];
              if (v < min) min = v;
              if (v > max) max = v;
            }
          }
          const x = i;
          const y1 = (0.5 + min * amp * 0.5) * canvas.height;
          const y2 = (0.5 + max * amp * 0.5) * canvas.height;
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
        }
        ctx.stroke();
      }

      togglePlay() {
        if (!this.audioBuffer) return;
        if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
      }

      play() {
        if (!this.audioBuffer) return;
        if (this.isPlaying) return;
        
        // Resume audio context if suspended
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        
        this.stopPlayback();
        const source = audioCtx.createBufferSource();
        source.buffer = this.audioBuffer;
        source.loop = this.loopActive;
        
        if (this.loopActive) {
          const loopLen = parseFloat(this.ui.loopLen.value);
          // Calculate loop duration based on BPM and beat length
          const bpm = this.bpm || 120;
          const beatDuration = 60 / bpm;
          const loopDuration = beatDuration * 4 * loopLen; // 4 beats per bar
          
          source.loopStart = this.currentTime;
          source.loopEnd = Math.min(this.currentTime + loopDuration, this.audioBuffer.duration);
          
          // If loop end is at the end of track, adjust
          if (source.loopEnd >= this.audioBuffer.duration - 0.1) {
            source.loopEnd = this.audioBuffer.duration;
          }
        }
        
        source.playbackRate.value = this.tempo;
        this.source = source;
        source.connect(this.gainNode);
        this.startTime = audioCtx.currentTime;
        this.startOffset = this.currentTime;
        this.isPlaying = true;
        source.start(0, this.currentTime);
        this.ui.playBtn.textContent = '⏸ PAUSE';
        this.ui.playBtn.classList.add('active');
        this.updateTimeLoop();
        this.updateJog();
      }

      pause() {
        if (!this.isPlaying) return;
        this.currentTime = this.startOffset + (audioCtx.currentTime - this.startTime);
        if (this.currentTime > this.audioBuffer.duration) this.currentTime = this.audioBuffer.duration;
        this.stopPlayback();
        this.isPlaying = false;
        this.ui.playBtn.textContent = '▶ PLAY';
        this.ui.playBtn.classList.remove('active');
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
      }

      stopPlayback() {
        if (this.source) {
          try { 
            this.source.stop(); 
            this.source.disconnect();
          } catch(e) {}
          this.source = null;
        }
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
      }

      seek(time) {
        if (!this.audioBuffer) return;
        this.currentTime = Math.max(0, Math.min(time, this.audioBuffer.duration));
        if (this.isPlaying) {
          const wasPlaying = this.isPlaying;
          this.stopPlayback();
          this.startOffset = this.currentTime;
          this.startTime = audioCtx.currentTime;
          if (wasPlaying) {
            this.play();
          }
        } else {
          this.updateTimeDisplay();
          this.updatePlayhead();
        }
      }

      goToCue() {
        if (!this.audioBuffer) return;
        this.seek(this.cuePoint);
      }

      setTempo(val) {
        this.tempo = 1 + val/100;
        this.ui.tempoDisplay.textContent = val + '%';
        if (this.source) this.source.playbackRate.value = this.tempo;
      }

      handleHotcue(idx) {
        if (!this.audioBuffer) return;
        const btn = this.ui.hotcueBtns[idx];
        if (this.hotCues[idx] === null) {
          this.hotCues[idx] = this.currentTime;
          btn.classList.add('stored');
          btn.textContent = (idx+1) + '✓';
        } else {
          this.seek(this.hotCues[idx]);
          btn.classList.add('active');
          setTimeout(() => btn.classList.remove('active'), 300);
        }
      }

      updateTimeLoop() {
        if (!this.isPlaying) {
          if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
          }
          return;
        }
        
        const now = audioCtx.currentTime;
        const elapsed = now - this.startTime;
        this.currentTime = this.startOffset + elapsed;
        
        if (this.currentTime >= this.audioBuffer.duration) {
          this.pause();
          this.currentTime = this.audioBuffer.duration;
          this.updateTimeDisplay();
          this.updatePlayhead();
          return;
        }
        
        this.updateTimeDisplay();
        this.updatePlayhead();
        this.updateJog();
        
        this.rafId = requestAnimationFrame(() => this.updateTimeLoop());
      }

      updateTimeDisplay() {
        const t = this.currentTime || 0;
        this.ui.current.textContent = this.formatTime(t);
      }

      updatePlayhead() {
        if (!this.audioBuffer) return;
        const pct = (this.currentTime / this.audioBuffer.duration) * 100;
        this.ui.playhead.style.left = Math.min(100, pct) + '%';
      }

      updateJog() {
        if (this.isPlaying) {
          const rot = (this.currentTime * 60) % 360;
          this.ui.jog.style.transform = `rotate(${rot}deg)`;
        }
      }

      formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
      }
    }

    window.deckA = new Deck('A');
    window.deckB = new Deck('B');

    // crossfader init
    document.getElementById('crossfader').dispatchEvent(new Event('input'));

    // ---------- LIBRARY / DRAG DROP ----------
    const library = [];
    const libraryList = document.getElementById('libraryList');
    const fileInput = document.getElementById('fileInput');
    const addBtn = document.getElementById('addMusicBtn');
    const dropZone = document.getElementById('dropZone');
    const searchInput = document.getElementById('searchLib');

    function renderLibrary(filter='') {
      libraryList.innerHTML = '';
      const items = library.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()));
      items.forEach(file => {
        const div = document.createElement('div');
        div.className = 'lib-track';
        div.draggable = true;
        div.dataset.fileId = file.id;
        div.innerHTML = `${file.name} <span class="dur">${file.duration || ''}</span>`;
        div.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', file.id);
        });
        libraryList.appendChild(div);
      });
    }

    function addFiles(files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          audioCtx.decodeAudioData(e.target.result, (buffer) => {
            const id = 'f' + Date.now() + Math.random();
            library.push({ id, name: file.name, buffer, duration: formatTime(buffer.duration) });
            renderLibrary(searchInput.value);
          }, (err) => { console.warn('decode error', err); });
        };
        reader.readAsArrayBuffer(file);
      }
    }

    function formatTime(s) {
      const m = Math.floor(s/60);
      const sec = Math.floor(s%60);
      return `${m}:${String(sec).padStart(2,'0')}`;
    }

    addBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => { addFiles(e.target.files); e.target.value=''; });

    // drag over deck highlight
    document.querySelectorAll('.deck').forEach(deck => {
      deck.addEventListener('dragover', (e) => { e.preventDefault(); deck.classList.add('drag-over'); });
      deck.addEventListener('dragleave', () => { deck.classList.remove('drag-over'); });
      deck.addEventListener('drop', (e) => {
        e.preventDefault();
        deck.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain');
        const file = library.find(f => f.id === id);
        if (!file) return;
        const deckId = deck.dataset.deck;
        const d = deckId === 'A' ? window.deckA : window.deckB;
        d.loadBuffer(file.buffer);
        d.ui.title.textContent = file.name;
        d.ui.artist.textContent = '—';
        d.ui.bpm.textContent = '-- BPM';
        d.bpm = 120;
      });
    });

    // drop zone library
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    });

    searchInput.addEventListener('input', () => renderLibrary(searchInput.value));

    // keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      const key = e.key.toLowerCase();
      
      // Deck A controls
      if (key === ' ' || key === 'space') { 
        e.preventDefault(); 
        if (window.deckA.isPlaying) window.deckA.pause(); 
        else window.deckA.play(); 
      }
      if (key === 'a') { e.preventDefault(); window.deckA.play(); }
      if (key === 's') { e.preventDefault(); window.deckA.goToCue(); }
      
      // Deck B controls
      if (key === 'k') { e.preventDefault(); window.deckB.play(); }
      if (key === 'l') { e.preventDefault(); window.deckB.goToCue(); }
      
      // Hot cues Deck A
      if (key === 'q') { e.preventDefault(); window.deckA.handleHotcue(0); }
      if (key === 'w') { e.preventDefault(); window.deckA.handleHotcue(1); }
      if (key === 'e') { e.preventDefault(); window.deckA.handleHotcue(2); }
      if (key === 'r') { e.preventDefault(); window.deckA.handleHotcue(3); }
      
      // Hot cues Deck B
      if (key === 'u') { e.preventDefault(); window.deckB.handleHotcue(0); }
      if (key === 'i') { e.preventDefault(); window.deckB.handleHotcue(1); }
      if (key === 'o') { e.preventDefault(); window.deckB.handleHotcue(2); }
      if (key === 'p') { e.preventDefault(); window.deckB.handleHotcue(3); }
    });

    // init library
    renderLibrary();
    console.log('🎧 Virtual DJ ready — drag files to decks!');
  })();