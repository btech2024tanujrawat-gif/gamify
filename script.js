
    // Simple SPA Router (hash-based)
    const routes = {};
    function register(path, render){ routes[path] = render; }
    function onRoute(){
      const path = location.hash.replace('#','') || '/';
      const view = document.getElementById('view');
      const render = routes[path] || routes['/404'];
      view.innerHTML = '';
      const el = render();
      view.appendChild(el);
      view.classList.remove('route-enter');
      void view.offsetWidth; // reflow
      view.classList.add('route-enter');
      highlightNav(path);
    }
    window.addEventListener('hashchange', onRoute);

    // State (demo data)
    const state = {
      user: {
        id: 'u1', name: 'Tanuj Rawat', role: 'Student', inst: 'Punjab Engineering College',
        city: 'Chandigarh', state: 'Punjab', nickname: '', hideName: false,
        points: 120, level: 1, streak: 0, badges: 1, avatar: null
      },
      counters: { students: 23540, tasks: 128904, trees: 15432 },
      impact: { trees: 52340, plastic: 8420, energy: 192340 },
      tasks: [
        { id: 't1', title: 'Plant a native sapling', category: 'Biodiversity', city: 'Chandigarh', state: 'Punjab', status: 'Pending', user: 'Aarav A' },
        { id: 't2', title: 'Clean a local park', category: 'Waste', city: 'Amritsar', state: 'Punjab', status: 'Approved', user: 'Diya D' },
        { id: 't3', title: 'Switch to LED bulbs', category: 'Energy', city: 'Ludhiana', state: 'Punjab', status: 'Pending', user: 'Riya R' },
      ],
      seasons: [
        { code:'S1-2025', label:'Season 1: Jan–Mar 2025', winners: { school:'Govt Model Sr Sec', college:'Punjab Engineering College', professional:'Green NGO Punjab' }, stats: '1.2M pts' },
        { code:'S4-2024', label:'Season 4: Oct–Dec 2024', winners: { school:'City Public School', college:'PAU Ludhiana', professional:'Eco Club Chandigarh' }, stats: '0.98M pts' },
      ],
      rewards: [
        { id:'r1', tier:'Bronze', name:'Digital Badge: Leaf Starter', cost:50, desc:'Kickstart your journey', kind:'badge' },
        { id:'r5', tier:'Gold', name:'Certificate of Merit', cost:250, desc:'Share your achievement', kind:'certificate' },
        { id:'r2', tier:'Silver', name:'Eco Tote Bag', cost:300, desc:'Reusable tote', kind:'merch' },
        { id:'r3', tier:'Silver', name:'Steel Water Bottle', cost:200, desc:'Stay hydrated', kind:'merch' },
        { id:'r4', tier:'Gold', name:'Voucher ₹200', cost:400, desc:'Partner voucher', kind:'voucher' },
        { id:'r6', tier:'Platinum', name:'School Trophy', cost:1200, desc:'Institutional honor', kind:'trophy' },
      ],
      posts: [
        { id:'p1', title:'10 Simple Water-Saving Tips', tag:'Guide' },
        { id:'p2', title:'How Punjab Schools Lead on Climate Action', tag:'Case Study' },
        { id:'p3', title:'Biodiversity Quiz Pack for Teachers', tag:'Lesson' },
      ],
      testimonials: [
        { who:'Student, Chandigarh', text:'EcoGamify makes learning fun — the badges keep me motivated!' },
        { who:'Teacher, Amritsar', text:'Approval workflow is smooth and saves time.' },
        { who:'NGO Lead, Ludhiana', text:'Tasks align with our on-ground campaigns.' },
      ],
      leaderboard: [],
      collegeAgg: [],
      filter: { category: 'School', timeframe: 'Daily', state: 'Punjab', city: 'All' },
      ui: { punjabDefault: true },
      activity: [],
      users: [
        { id:'u1', name:'Tanuj Rawat', role:'Student', inst:'Punjab Engineering College', city:'Chandigarh', state:'Punjab', active:true, points:120 },
        { id:'u2', name:'Prince Verma', role:'Teacher', inst:'City Public College', city:'Amritsar', state:'Punjab', active:true, points:340 },
        { id:'u3', name:'Rishabh Y', role:'Admin', inst:'EcoGamify', city:'Chandigarh', state:'Punjab', active:true, points:0 },
        { id:'u4', name:'Deepak Kumar', role:'NGO', inst:'Green NGO', city:'Ludhiana', state:'Punjab', active:true, points:880 },
      ]
    };

    // Persistence (demo)
    const saved = JSON.parse(localStorage.getItem('eco_demo')||'{}');
    if (saved.user) Object.assign(state.user, saved.user);
    if (saved.filter) Object.assign(state.filter, saved.filter);
    if (saved.ui) Object.assign(state.ui, saved.ui);

    function persist(){
      localStorage.setItem('eco_demo', JSON.stringify({ user: state.user, filter: state.filter, ui: state.ui }));
    }

    // Utilities
    const uid = () => Math.random().toString(36).slice(2,9);
    function el(tag, cls){ const e=document.createElement(tag); if (cls) e.className=cls; return e; }
    function section(title){
      const wrap = el('section','py-10');
      const container = el('div','max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
      const h = el('h2','text-3xl font-extrabold text-emerald-800');
      h.textContent = title;
      container.appendChild(h);
      wrap.appendChild(container);
      return { wrap, container, h };
    }
    function celebrate(){
      const conf = document.getElementById('confetti'); conf.innerHTML='';
      const colors = ['#22c55e','#0ea5a8','#f59e0b','#06b6d4','#84cc16'];
      for(let i=0;i<50;i++){ const p=document.createElement('i');
        p.style.left = Math.random()*100+'vw'; p.style.background = colors[i%colors.length];
        p.style.transform='translateY(-10vh)'; p.style.animationDuration=(0.7+Math.random()*0.8)+'s'; p.style.animationDelay=(Math.random()*0.2)+'s';
        conf.appendChild(p);
      } setTimeout(()=>conf.innerHTML='',1200);
    }
    function rewardIcon(kind){ if(kind==='badge')return'🏅'; if(kind==='certificate')return'📜'; if(kind==='trophy')return'🏆'; if(kind==='voucher')return'🎟️'; return '🎁'; }

    // Navbar behaviour
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    mobileBtn.addEventListener('click', ()=> mobileDrawer.classList.toggle('hidden'));
    const topbar = document.getElementById('topbar');
    const setShadow = () => { if (window.scrollY>6) topbar.classList.add('sticky-shadow'); else topbar.classList.remove('sticky-shadow');};
    setShadow(); window.addEventListener('scroll', setShadow, { passive:true });

    function highlightNav(path){
      const links = document.querySelectorAll('.nav-link');
      links.forEach(a=> {
        const tgt = a.getAttribute('href');
        if (tgt === '#'+path) a.classList.add('bg-emerald-50');
        else a.classList.remove('bg-emerald-50');
      });
    }

    // Role switcher (demo "auth")
    document.getElementById('roleSwitcher').addEventListener('change', (e)=>{
      const role = e.target.value;
      state.user.role = role[0].toUpperCase()+role.slice(1);
      persist();
      if (role==='admin') alert('Admin mode enabled. Open the Admin page to manage users, proofs, rewards, seasons, and analytics.');
    });

    // Global search influences multiple views where present
    document.getElementById('globalSearch').addEventListener('input', (e)=>{
      state.search = e.target.value?.toLowerCase()||'';
      // Route-specific re-render for responsive feel
      onRoute();
    });

    // Seed leaderboard
    function seedLeaderboard(){
      const names = ['Aarav','Vihaan','Anaya','Ishaan','Diya','Kabir','Riya','Advait','Zoya','Vivaan','Aanya','Parth','Ira','Anika','Aditi'];
      const insts = ['Govt Sr Sec School','Model College','Green NGO','Eco Club','City School','Public College','Tech Univ','Punjab Engineering College','PAU Ludhiana'];
      const states = ['Punjab','Delhi','Maharashtra','Karnataka','Tamil Nadu','West Bengal'];
      const punjabCities = ['Chandigarh','Amritsar','Ludhiana','Jalandhar','Patiala','Bathinda'];
      const cities = [...punjabCities,'Mumbai','Delhi','Bengaluru','Chennai','Kolkata'];
      const cats = ['School','College','Working'];
      state.leaderboard = [];
      for (let i=0;i<90;i++){
        const st = states[Math.floor(Math.random()*states.length)];
        const cityPool = st==='Punjab' ? punjabCities : cities;
        state.leaderboard.push({
          id: uid(),
          name: names[i%names.length] + ' ' + String.fromCharCode(65+(i%26)),
          inst: insts[i%insts.length],
          city: cityPool[Math.floor(Math.random()*cityPool.length)],
          state: st,
          category: cats[i%cats.length],
          points: 200 + Math.floor(Math.random()*12000),
          badges: 1 + (i%6)
        });
      }
      // include current user
      state.leaderboard.push({ id: state.user.id, name: state.user.name, inst: state.user.inst, city: state.user.city, state: state.user.state, category: 'College', points: state.user.points, badges: state.user.badges });
    }
    seedLeaderboard();

    // Home
    register('/', () => {
      const root = document.createElement('div');
      // Hero
      const hero = el('section','gradient-hero pt-10 sm:pt-16');
      const hC = el('div','max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
      const grid = el('div','grid md:grid-cols-2 gap-10 items-center');
      const left = el('div');
      left.innerHTML = `
        <h1 class="text-3xl sm:text-5xl font-extrabold leading-tight text-emerald-800">Join India’s Eco-Revolution</h1>
        <p class="mt-3 text-lg sm:text-xl text-slate-600">Turn learning into real-world impact with quizzes, eco-tasks, rewards and leaderboards — Punjab-first and SIH-ready.</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a href="#/rewards" class="shine hover-float bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold ring-focus">Join the Eco‑Revolution</a>
          <button id="ctaDemo" class="shine hover-float bg-white text-emerald-700 border border-emerald-200 px-5 py-3 rounded-xl font-semibold ring-focus">Request Demo</button>
          <a href="#/leaderboard" class="shine hover-float bg-amber-100 text-amber-800 border border-amber-200 px-5 py-3 rounded-xl font-semibold ring-focus">Track Your Rank</a>
        </div>
        <div class="mt-8 grid grid-cols-3 gap-4">
          <div class="p-4 bg-white rounded-xl border border-slate-100 soft-shadow hover-float"><div class="text-sm text-slate-500">Students Joined</div><div id="countStudents" class="text-2xl font-extrabold text-emerald-700">0</div></div>
          <div class="p-4 bg-white rounded-xl border border-slate-100 soft-shadow hover-float"><div class="text-sm text-slate-500">Tasks Completed</div><div id="countTasks" class="text-2xl font-extrabold text-emerald-700">0</div></div>
          <div class="p-4 bg-white rounded-xl border border-slate-100 soft-shadow hover-float"><div class="text-sm text-slate-500">Trees Planted</div><div id="countTrees" class="text-2xl font-extrabold text-emerald-700">0</div></div>
        </div>
        <div class="mt-10 grid sm:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-100 hover-float"><div class="text-2xl">📘</div><h3 class="font-bold text-emerald-900 mt-2">Learn</h3><p class="text-slate-600 text-sm">Short, fun quizzes with instant feedback and streaks.</p></div>
          <div class="p-4 rounded-xl bg-sky-50 border border-sky-100 hover-float"><div class="text-2xl">🛠️</div><h3 class="font-bold text-sky-900 mt-2">Do</h3><p class="text-slate-600 text-sm">Complete geo-tagged eco-tasks and submit proof.</p></div>
          <div class="p-4 rounded-xl bg-amber-50 border border-amber-100 hover-float"><div class="text-2xl">🏅</div><h3 class="font-bold text-amber-900 mt-2">Earn Points</h3><p class="text-slate-600 text-sm">Climb leaderboards and unlock badges & rewards.</p></div>
        </div>
      `;
      const right = el('div','bg-white border border-slate-100 rounded-2xl p-5 soft-shadow');
      right.innerHTML = `
        <div class="flex items-center justify-between"><h2 class="font-extrabold text-slate-800">Quick Demo</h2><span class="text-xs text-slate-500">Demo only — no real data</span></div>
        <div class="mt-4 grid sm:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div class="flex items-center justify-between"><h3 class="font-bold">Mini Quiz</h3><span class="badge bg-emerald-100 text-emerald-800">Energy</span></div>
            <p class="text-sm text-slate-600 mt-1">Q1: Which uses less energy?</p>
            <form id="miniQuiz" class="mt-2 space-y-2">
              <label class="flex items-center gap-2"><input type="radio" name="q1" value="A" class="accent-emerald-600"> Incandescent bulb</label>
              <label class="flex items-center gap-2"><input type="radio" name="q1" value="B" class="accent-emerald-600"> LED bulb</label>
              <div class="flex items-center gap-2 mt-3">
                <button class="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Submit</button>
                <span id="miniQuizResult" class="text-sm font-semibold"></span>
              </div>
            </form>
          </div>
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div class="flex items-center justify-between"><h3 class="font-bold">Eco-Task</h3><span class="badge bg-sky-100 text-sky-800">Waste</span></div>
            <p class="text-sm text-slate-600 mt-1">Segregate waste at home for 3 days.</p>
            <button id="taskCompleteBtn" class="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg ring-focus">Mark Complete</button>
            <div class="mt-3"><div class="h-2 bg-slate-200 rounded-full"><div id="taskProgress" class="h-2 bg-sky-500 rounded-full transition-all duration-500" style="width:0%"></div></div>
            <div class="text-xs text-slate-500 mt-1">Progress: <span id="taskProgressText">0%</span></div></div>
          </div>
        </div>
        <div class="mt-5 flex flex-wrap items-center gap-6">
          <div class="relative w-24 h-24">
            <svg width="96" height="96" style="transform:rotate(-90deg)">
              <circle cx="48" cy="48" r="42" stroke="#e2e8f0" stroke-width="10" fill="none"></circle>
              <circle id="xpRing" cx="48" cy="48" r="42" stroke="url(#grad)" stroke-width="10" stroke-linecap="round" fill="none" stroke-dasharray="264" stroke-dashoffset="264"></circle>
              <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#0ea5a8"/></linearGradient></defs>
            </svg>
            <div id="xpText" class="absolute inset-0 grid place-items-center font-extrabold text-emerald-700">0 XP</div>
          </div>
          <div class="flex-1">
            <div class="text-sm text-slate-500">Rewards</div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span class="badge bg-emerald-50 text-emerald-700 border border-emerald-200">Leaf Starter 🍃</span>
              <span class="badge bg-amber-50 text-amber-800 border border-amber-200">Streak x2 🔥</span>
              <a href="#/rewards" class="badge bg-white text-emerald-800 border border-slate-200 hover:bg-emerald-50 ring-focus">Open Reward Store</a>
            </div>
          </div>
        </div>
      `;
      grid.append(left,right); hC.appendChild(grid); hero.appendChild(hC);

      // Quick numbers animate
      requestAnimationFrame(()=> {
        animateNumber(document.getElementById('countStudents'), state.counters.students);
        animateNumber(document.getElementById('countTasks'), state.counters.tasks);
        animateNumber(document.getElementById('countTrees'), state.counters.trees);
        updateXPUI();
        bindHeroDemo();
      });

      root.appendChild(hero);

      // Feature highlights (short)
      const feat = section('Highlights');
      feat.container.insertAdjacentHTML('beforeend', `
        <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 bg-white border border-slate-100 rounded-xl soft-shadow hover-float"><div class="text-2xl">🧩</div><h3 class="font-bold mt-2">Quizzes</h3><p class="text-sm text-slate-600">Instant scoring, streaks and eco-facts.</p></div>
          <div class="p-5 bg-white border border-slate-100 rounded-xl soft-shadow hover-float"><div class="text-2xl">📍</div><h3 class="font-bold mt-2">Real‑world Tasks</h3><p class="text-sm text-slate-600">Geo-tag, upload proof, get verified.</p></div>
          <div class="p-5 bg-white border border-slate-100 rounded-xl soft-shadow hover-float"><div class="text-2xl">🎁</div><h3 class="font-bold mt-2">Rewards & Ranks</h3><p class="text-sm text-slate-600">Earn XP, badges and climb the charts.</p></div>
          <div class="p-5 bg-white border border-slate-100 rounded-xl soft-shadow hover-float"><div class="text-2xl">🗺️</div><h3 class="font-bold mt-2">State Rankings</h3><p class="text-sm text-slate-600">Punjab-first with national view.</p></div>
        </div>
      `);
      root.appendChild(feat.wrap);
      return root;
    });

    function animateNumber(el, target, duration=1200){
      let start=0; const t0=performance.now();
      const step=(t)=>{ const p=Math.min((t-t0)/duration,1); const val=Math.floor(p*target);
        if (val!==start){ start=val; el.textContent = val.toLocaleString('en-IN'); }
        if (p<1) requestAnimationFrame(step);
      }; requestAnimationFrame(step);
    }
    const XP_RING_CIRC = 2 * Math.PI * 42;
    function updateXPUI(){
      const ring = document.getElementById('xpRing'); if(!ring) return;
      const text = document.getElementById('xpText');
      const p = Math.min(1, (state.user.points % 100) / 100);
      ring.style.strokeDasharray = XP_RING_CIRC;
      ring.style.strokeDashoffset = XP_RING_CIRC * (1 - p);
      text.textContent = `${state.user.points} XP`;
    }
    function bindHeroDemo(){
      const res = document.getElementById('miniQuizResult');
      document.getElementById('miniQuiz').addEventListener('submit',(e)=>{
        e.preventDefault();
        const ans = new FormData(e.target).get('q1');
        if (ans==='B'){ state.user.points+=10; res.textContent='Correct! +10 pts'; res.className='text-sm font-semibold text-emerald-700'; updateXPUI(); celebrate();}
        else { res.textContent='Try again!'; res.className='text-sm font-semibold text-slate-600';}
      });
      let pct=0;
      const bar = document.getElementById('taskProgress'); const txt = document.getElementById('taskProgressText');
      document.getElementById('taskCompleteBtn').addEventListener('click',()=> {
        pct = Math.min(100, pct+50); bar.style.width = pct+'%'; txt.textContent = pct+'%';
        if (pct===100){ state.user.points+=15; updateXPUI(); celebrate();}
      });
      // demo modal
      document.getElementById('ctaDemo').addEventListener('click', ()=> alert('Demo request received! (frontend demo only)'));
    }

    // About
    register('/about', () => {
      const root = el('div');
      const sec = section('About EcoGamify');
      sec.container.insertAdjacentHTML('beforeend', `
        <div class="grid lg:grid-cols-3 gap-8 mt-4">
          <div class="lg:col-span-2">
            <p class="text-slate-700">India faces pressing environmental challenges — from waste management to water and energy conservation. EcoGamify makes climate literacy engaging with a playful, measurable approach aligned to NEP 2020 and SDGs.</p>
            <div class="mt-6 grid sm:grid-cols-3 gap-4">
              <div class="p-4 bg-white border border-slate-100 rounded-xl hover-float">
                <h3 class="font-bold">NEP 2020</h3><p class="text-sm text-slate-600">Project-based, experiential learning.</p>
              </div>
              <div class="p-4 bg-white border border-slate-100 rounded-xl hover-float">
                <h3 class="font-bold">SDGs</h3><p class="text-sm text-slate-600">SDG 4, 11, 12, 13 focus.</p>
              </div>
              <div class="p-4 bg-white border border-slate-100 rounded-xl hover-float">
                <h3 class="font-bold">Measurable Impact</h3><p class="text-sm text-slate-600">Trees planted, plastic saved, energy conserved.</p>
              </div>
            </div>
            <div class="mt-8 p-5 rounded-xl border border-emerald-200 bg-emerald-50">
              <div class="flex items-center gap-3"><span class="text-2xl">🤝</span>
                <div><h3 class="font-extrabold text-emerald-900">Built in collaboration with Government of Punjab (SIH)</h3>
                <p class="text-sm text-emerald-800/90">Punjab-first deployment with scalable national rollout.</p></div>
              </div>
            </div>
          </div>
          <aside class="lg:col-span-1">
            <div class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
              <h3 class="font-bold">Vision & Impact</h3>
              <ul class="mt-3 space-y-2 text-sm text-slate-700">
                <li>• 1M students onboarded</li>
                <li>• 100k trees planted</li>
                <li>• 500+ institutions verified</li>
              </ul>
              <a href="#/team" class="mt-4 inline-block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl ring-focus">Meet the Team</a>
            </div>
            <div class="mt-4 p-4 bg-white border border-slate-100 rounded-2xl">
              <div class="text-xs text-slate-500 mb-2">Badge Placeholder</div>
              <div class="w-full h-24 rounded-xl border-2 border-dashed border-emerald-300 grid place-items-center text-emerald-700 font-semibold">Government of Punjab</div>
            </div>
          </aside>
        </div>
      `);
      root.appendChild(sec.wrap);
      return root;
    });

    // Features (kept concise; quiz + tasks + gamification)
    register('/features', () => {
      const root = el('div');
      const sec = section('Features');
      sec.container.insertAdjacentHTML('beforeend', `
        <div class="mt-6 grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <div class="flex items-center justify-between"><h3 class="font-bold text-xl">Quizzes & Learning Modules</h3>
              <div class="flex gap-2">
                <span class="badge bg-emerald-50 text-emerald-700 border border-emerald-200">Streaks</span>
                <span class="badge bg-sky-50 text-sky-700 border border-sky-200">Instant Score</span>
                <span class="badge bg-amber-50 text-amber-800 border border-amber-200">Timed/Untimed</span>
              </div>
            </div>
            <div class="mt-4 p-4 rounded-xl bg-white border border-slate-200">
              <p class="text-sm text-slate-600">Demo Q: Best way to save water at home?</p>
              <form id="featureQuiz" class="mt-2 space-y-2">
                <label class="flex items-center gap-2"><input type="radio" name="q" value="A" class="accent-emerald-600"> Keep tap running</label>
                <label class="flex items-center gap-2"><input type="radio" name="q" value="B" class="accent-emerald-600"> Turn off tap while brushing</label>
                <label class="flex items-center gap-2"><input type="radio" name="q" value="C" class="accent-emerald-600"> Longer showers</label>
                <div class="flex items-center gap-2 mt-3">
                  <button class="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Submit</button>
                  <span id="featureQuizResult" class="text-sm font-semibold"></span>
                  <span id="streak" class="ml-auto text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">Streak: 0 🔥</span>
                </div>
              </form>
              <div class="mt-3 text-xs text-slate-500">Eco-fact: Fixing a leaky tap can save up to 3,000 gallons/year.</div>
            </div>
          </div>
          <aside class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <h4 class="font-bold">Progress</h4>
            <div class="mt-3">
              <div class="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div id="quizProgress" class="h-3 bg-emerald-500 w-0 transition-all duration-700"></div>
              </div>
              <div class="text-xs text-slate-500 mt-1">Modules completed: <span id="quizProgressText">0%</span></div>
            </div>
          </aside>
        </div>

        <div class="mt-10 grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <div class="flex items-center justify-between"><h3 class="font-bold text-xl">Eco‑Tasks</h3><div class="text-xs text-slate-500">Verification workflow (Demo)</div></div>
            <div id="taskList" class="mt-4 grid sm:grid-cols-2 gap-4"></div>
            <div class="mt-4 flex items-center gap-2">
              <button id="addTask" class="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 ring-focus">Add Sample Task</button>
              <span class="text-xs text-slate-500">Teacher/NGO can approve or reject proofs.</span>
            </div>
          </div>
          <aside class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <h4 class="font-bold">Admin & Institution Tools (Demo)</h4>
            <ul class="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Onboard institutions</li>
              <li>• Approve proofs</li>
              <li>• Manage rewards</li>
              <li>• Export reports</li>
            </ul>
            <div class="mt-4 grid grid-cols-2 gap-2">
              <button id="exportCSV" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg ring-focus">Export CSV</button>
              <button id="printPDF" class="bg-white text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-50 ring-focus">Print / PDF</button>
            </div>
          </aside>
        </div>
      `);
      root.appendChild(sec.wrap);

      // Bind quiz & tasks
      let streakQuiz=0;
      sec.container.querySelector('#featureQuiz').addEventListener('submit',(e)=>{
        e.preventDefault();
        const ans = new FormData(e.target).get('q');
        const msg = sec.container.querySelector('#featureQuizResult');
        if(ans==='B'){ streakQuiz++; state.user.points+=20; msg.textContent='Correct! +20 pts'; msg.className='text-sm font-semibold text-emerald-700'; celebrate();
          const done = Math.min(100, streakQuiz*20); sec.container.querySelector('#quizProgress').style.width=done+'%'; sec.container.querySelector('#quizProgressText').textContent=done+'%';
        } else { streakQuiz=0; msg.textContent='Oops, try again!'; msg.className='text-sm font-semibold text-slate-600'; sec.container.querySelector('#quizProgress').style.width='0%'; sec.container.querySelector('#quizProgressText').textContent='0%'; }
      });
      renderTasksList(sec.container.querySelector('#taskList'));
      sec.container.querySelector('#addTask').addEventListener('click', ()=> { state.tasks.push({ id: uid(), title:'Neighborhood clean-up drive', category:'Waste', city:'Ludhiana', state:'Punjab', status:'Pending', user:'Advait A' }); renderTasksList(sec.container.querySelector('#taskList')); });
      sec.container.querySelector('#exportCSV').addEventListener('click', exportTasksCSV);
      sec.container.querySelector('#printPDF').addEventListener('click', ()=> window.print());
      return root;
    });

    function renderTasksList(container){
      container.innerHTML='';
      (state.tasks.filter(t => !state.search || t.title.toLowerCase().includes(state.search)||t.category.toLowerCase().includes(state.search))).forEach(t=>{
        const card = el('div','p-4 rounded-xl bg-slate-50 border border-slate-200');
        card.innerHTML = `
          <div class="flex items-start justify-between">
            <div><div class="font-bold">${t.title}</div><div class="text-xs text-slate-500">${t.category} • ${t.city}, ${t.state} • by ${t.user}</div></div>
            <span class="badge ${t.status==='Approved'?'bg-emerald-100 text-emerald-800 border border-emerald-200': t.status==='Rejected'?'bg-rose-100 text-rose-800 border border-rose-200':'bg-amber-100 text-amber-800 border border-amber-200'}">${t.status}</span>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <button data-id="${t.id}" data-action="approve" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 ring-focus">Approve</button>
            <button data-id="${t.id}" data-action="reject" class="px-3 py-1.5 bg-white text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-50 ring-focus">Reject</button>
            <button data-id="${t.id}" data-action="proof" class="ml-auto px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 ring-focus">View Proof</button>
          </div>
        `;
        container.appendChild(card);
      });
      container.querySelectorAll('button').forEach(b=>{
        b.addEventListener('click', ()=>{
          const id=b.getAttribute('data-id'); const act=b.getAttribute('data-action'); const t=state.tasks.find(x=>x.id===id); if(!t) return;
          if(act==='approve'){ t.status='Approved'; state.user.points+=10; celebrate(); }
          if(act==='reject'){ t.status='Rejected'; }
          if(act==='proof'){ alert('Demo: Proof preview placeholder.'); }
          renderTasksList(container);
        });
      });
    }
    function exportTasksCSV(){
      const rows = [['Title','Category','City','State','Status','User']].concat(state.tasks.map(t=>[t.title,t.category,t.city,t.state,t.status,t.user]));
      const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='ecogamify_tasks_demo.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }

    // Leaderboard Page
    register('/leaderboard', () => {
      const root = el('div');
      const sec = section('Leaderboards');
      const defaultState = state.ui.punjabDefault ? 'Punjab' : state.filter.state;
      state.filter.state = defaultState; persist();
      sec.container.insertAdjacentHTML('beforeend', `
        <div class="flex flex-wrap items-center gap-3 justify-between mt-2">
          <div class="flex flex-wrap items-center gap-2">
            <button data-tab="Punjab" class="lb-tab bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Punjab View</button>
            <button data-tab="AllIndia" class="lb-tab bg-white text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50 ring-focus">All India</button>
          </div>
          <div class="flex items-center gap-2 text-xs"><label class="flex items-center gap-2 cursor-pointer"><input id="toggleDefaultPunjab" type="checkbox" ${state.ui.punjabDefault?'checked':''} class="accent-emerald-600"><span>Make Punjab default view</span></label></div>
        </div>
        <div class="mt-4 grid lg:grid-cols-5 gap-3">
          <div><label class="text-xs text-slate-500">Category</label>
            <select id="fCategory" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
              <option value="School" ${state.filter.category==='School'?'selected':''}>School</option>
              <option value="College" ${state.filter.category==='College'?'selected':''}>College</option>
              <option value="Working" ${state.filter.category==='Working'?'selected':''}>Working Class / NGOs</option>
            </select>
          </div>
          <div><label class="text-xs text-slate-500">Timeframe</label>
            <select id="fTimeframe" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
              <option ${state.filter.timeframe==='Daily'?'selected':''}>Daily</option>
              <option ${state.filter.timeframe==='Weekly'?'selected':''}>Weekly</option>
              <option ${state.filter.timeframe==='Monthly'?'selected':''}>Monthly</option>
              <option ${state.filter.timeframe==='Season'?'selected':''}>Season</option>
              <option ${state.filter.timeframe==='All-time'?'selected':''}>All-time</option>
            </select>
          </div>
          <div><label class="text-xs text-slate-500">State</label>
            <select id="fState" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
              ${['Punjab','Delhi','Maharashtra','Karnataka','Tamil Nadu','West Bengal'].map(s=>`<option ${state.filter.state===s?'selected':''}>${s}</option>`).join('')}
            </select>
          </div>
          <div><label class="text-xs text-slate-500">City</label>
            <select id="fCity" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
              ${['All','Chandigarh','Amritsar','Ludhiana','Jalandhar','Patiala','Bathinda'].map(c=>`<option ${state.filter.city===c?'selected':''}>${c}</option>`).join('')}
            </select>
          </div>
          <div><label class="text-xs text-slate-500">Quick Search</label>
            <input id="lbSearch" type="search" value="${state.search||''}" placeholder="Search name or institution" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
          </div>
        </div>

        <div id="punjabCities" class="mt-6 p-4 bg-white border border-emerald-200 rounded-xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2"><span class="text-xl">🧭</span><h3 class="font-bold">Punjab Cities</h3><span class="badge bg-emerald-50 text-emerald-700 border border-emerald-200">Default</span></div>
            <button id="togglePunjabList" class="text-emerald-700 hover:underline ring-focus">Collapse/Expand</button>
          </div>
          <div id="punjabCityList" class="mt-3 grid sm:grid-cols-3 lg:grid-cols-6 gap-2"></div>
        </div>

        <div class="mt-6 bg-white border border-slate-100 rounded-xl overflow-hidden soft-shadow">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-slate-50 text-slate-600">
                <tr><th class="text-left px-4 py-3">Rank</th><th class="text-left px-4 py-3">Name</th><th class="text-left px-4 py-3">Institution / City</th><th class="text-left px-4 py-3">State</th><th class="text-right px-4 py-3">Points</th><th class="text-left px-4 py-3">Badges</th></tr>
              </thead>
              <tbody id="lbBody"></tbody>
            </table>
          </div>
          <div class="flex items-center justify-between p-3 border-t border-slate-100">
            <div class="text-xs text-slate-500">Real-time updates (Demo)</div>
            <div class="flex items-center gap-2">
              <button id="prevPage" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 ring-focus">Prev</button>
              <span id="pageLabel" class="text-sm font-semibold">1</span>
              <button id="nextPage" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 ring-focus">Next</button>
            </div>
          </div>
        </div>

        <div class="mt-8 p-4 bg-white border border-slate-100 rounded-xl">
          <div class="flex items-center justify-between"><h3 class="font-bold text-xl">Season-wise Winners & Campaigns</h3><div class="text-xs text-slate-500">Current + Past Seasons</div></div>
          <div class="mt-4 overflow-hidden"><div id="seasonTrack" class="carousel-track"></div>
            <div class="flex items-center justify-center gap-2 mt-3">
              <button id="seasonPrev" class="px-2 py-1 bg-white border border-slate-200 rounded ring-focus">‹</button>
              <button id="seasonNext" class="px-2 py-1 bg-white border border-slate-200 rounded ring-focus">›</button>
            </div>
          </div>
        </div>

        <div class="mt-8 p-4 bg-white border border-slate-100 rounded-xl">
          <div class="flex items-center justify-between"><h3 class="font-bold text-xl">College Leaderboard — Aggregated Points</h3><div class="text-xs text-slate-500">Punjab-first</div></div>
          <div id="collegeList" class="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3"></div>
        </div>
      `);
      root.appendChild(sec.wrap);

      // Bind filters and table
      const punjabCities = ['Chandigarh','Amritsar','Ludhiana','Jalandhar','Patiala','Bathinda'];
      function renderPunjabCities(){
        const c = sec.container.querySelector('#punjabCityList'); c.innerHTML='';
        punjabCities.forEach(city=>{
          const b = el('button','px-3 py-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 ring-focus');
          b.textContent = city; b.addEventListener('click',()=>{ fState.value='Punjab'; fCity.value=city; state.filter.state='Punjab'; state.filter.city=city; page=1; renderLB(); persist(); });
          c.appendChild(b);
        });
        sec.container.querySelector('#togglePunjabList').addEventListener('click',()=> c.classList.toggle('hidden'));
      }
      renderPunjabCities();

      const fCategory = sec.container.querySelector('#fCategory');
      const fTimeframe = sec.container.querySelector('#fTimeframe');
      const fState = sec.container.querySelector('#fState');
      const fCity = sec.container.querySelector('#fCity');
      const lbSearch = sec.container.querySelector('#lbSearch');
      const toggleDefaultPunjab = sec.container.querySelector('#toggleDefaultPunjab');
      toggleDefaultPunjab.addEventListener('change', (e)=>{ state.ui.punjabDefault = e.target.checked; persist(); });

      fCategory.addEventListener('change',()=>{ state.filter.category = fCategory.value.includes('Working')?'Working':fCategory.value; page=1; renderLB(); persist(); });
      fTimeframe.addEventListener('change',()=>{ state.filter.timeframe = fTimeframe.value; renderLB(); persist(); });
      fState.addEventListener('change',()=>{ state.filter.state = fState.value; page=1; renderLB(); persist(); });
      fCity.addEventListener('change',()=>{ state.filter.city = fCity.value; page=1; renderLB(); persist(); });
      lbSearch.addEventListener('input',()=>{ state.search = lbSearch.value.toLowerCase(); page=1; renderLB(); });

      let tab='Punjab', page=1, pageSize=8;
      sec.container.querySelectorAll('.lb-tab').forEach(b=>{
        b.addEventListener('click',()=> {
          tab = b.getAttribute('data-tab');
          sec.container.querySelectorAll('.lb-tab').forEach(x=>{
            if (x===b) x.className='lb-tab bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 ring-focus';
            else x.className='lb-tab bg-white text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50 ring-focus';
          });
          renderLB();
        });
      });
      sec.container.querySelector('#prevPage').addEventListener('click',()=>{ if (page>1){ page--; renderLB(); }});
      sec.container.querySelector('#nextPage').addEventListener('click',()=>{ page++; renderLB(); });

      function displayName(r){
        if (r.id===state.user.id && state.user.hideName && state.user.nickname) return state.user.nickname;
        if (r.id===state.user.id && state.user.hideName) return 'Hidden (You)';
        return r.name;
      }
      function renderLB(){
        const body = sec.container.querySelector('#lbBody'); body.innerHTML='';
        let rows = state.leaderboard.slice();
        const you = rows.find(x=>x.id===state.user.id); if (you){ you.points = state.user.points; you.badges = state.user.badges; you.inst = state.user.inst; you.city = state.user.city; you.state = state.user.state; }
        if (tab==='Punjab') rows = rows.filter(r=>r.state==='Punjab');
        if (state.filter.category) rows = rows.filter(r=>r.category === (state.filter.category==='Working'?'Working':state.filter.category));
        if (state.filter.state) rows = rows.filter(r=>r.state===state.filter.state);
        if (state.filter.city && state.filter.city!=='All') rows = rows.filter(r=>r.city===state.filter.city);
        if (state.search) rows = rows.filter(r=> r.name.toLowerCase().includes(state.search) || r.inst.toLowerCase().includes(state.search));
        rows.sort((a,b)=> b.points-a.points);
        const totalPages = Math.max(1, Math.ceil(rows.length/pageSize));
        if (page>totalPages) page=totalPages;
        const start=(page-1)*pageSize; const pageRows = rows.slice(start, start+pageSize);
        sec.container.querySelector('#pageLabel').textContent = `${page}/${totalPages}`;
        pageRows.forEach((r,idx)=>{
          const tr = el('tr','border-t border-slate-100 '+(r.state==='Punjab'?'bg-emerald-50/30':''));
          tr.innerHTML = `
            <td class="px-4 py-3 font-semibold ${r.state==='Punjab'?'text-emerald-800':''}">#${start+idx+1}</td>
            <td class="px-4 py-3"><button class="text-emerald-700 hover:underline ring-focus lb-profile" data-id="${r.id}">${displayName(r)}</button> ${r.state==='Punjab'?'<span class="ml-2 badge bg-emerald-100 text-emerald-800 border border-emerald-200">Punjab</span>':''}</td>
            <td class="px-4 py-3">${r.inst} / ${r.city}</td>
            <td class="px-4 py-3">${r.state}</td>
            <td class="px-4 py-3 text-right font-bold">${r.points.toLocaleString('en-IN')}</td>
            <td class="px-4 py-3">${'🥇'.repeat(Math.min(3, Math.floor(r.badges/3)))} ${'🏅'.repeat(r.badges%3)}</td>
          `;
          if (r.state==='Punjab') tr.classList.add('punjab-outline');
          body.appendChild(tr);
        });
        body.querySelectorAll('.lb-profile').forEach(btn=>{
          btn.addEventListener('click', ()=>{
            const r = state.leaderboard.find(x=>x.id===btn.getAttribute('data-id'));
            if(!r) return;
            alert(`Mini Profile (Demo)\n\n${displayName(r)}\n${r.inst}, ${r.city}\nState: ${r.state}\nPoints: ${r.points}\nBadges: ${r.badges}`);
          });
        });
        renderCollegeAgg(sec.container.querySelector('#collegeList'));
        renderSeasons(sec.container.querySelector('#seasonTrack'));
      }
      function renderCollegeAgg(container){
        const col = state.leaderboard.filter(r=>r.category==='College');
        const map = new Map();
        col.forEach(r=>{ const key=r.inst+'|'+r.state; map.set(key,(map.get(key)||0)+r.points); });
        const agg = Array.from(map.entries()).map(([k,pts])=>{ const [inst, st]=k.split('|'); return { inst, state: st, points: pts }; }).sort((a,b)=>b.points-a.points).slice(0,9);
        container.innerHTML='';
        agg.forEach((c,i)=>{
          const card = el('div','p-4 rounded-xl bg-slate-50 border border-slate-200 hover-float');
          const punjabBadge = c.state==='Punjab' ? '<span class="badge bg-emerald-100 text-emerald-800 border border-emerald-200 ml-2">Punjab</span>' : '';
          card.innerHTML = `<div class="flex items-center justify-between"><div class="font-bold">${i+1}. ${c.inst} ${punjabBadge}</div><div class="text-sm font-semibold text-emerald-700">${c.points.toLocaleString('en-IN')} pts</div></div><div class="text-xs text-slate-600">${c.state}</div>`;
          container.appendChild(card);
        });
      }
      let seasonIndex=0;
      function renderSeasons(track){
        track.innerHTML='';
        state.seasons.forEach(s=>{
          const slide = el('div','min-w-full p-4');
          slide.innerHTML = `
            <div class="grid sm:grid-cols-4 gap-3 items-center">
              <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-100"><div class="text-xs text-emerald-800">Season</div><div class="text-lg font-extrabold text-emerald-700">${s.label}</div><div class="text-xs">${s.stats}</div></div>
              <div class="p-4 rounded-xl bg-amber-50 border border-amber-100"><div class="text-2xl">🥇</div><div class="font-bold">${s.winners.school}</div><div class="text-xs">Top School</div></div>
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200"><div class="text-2xl">🥈</div><div class="font-bold">${s.winners.college}</div><div class="text-xs">Top College</div></div>
              <div class="p-4 rounded-xl bg-orange-50 border border-orange-100"><div class="text-2xl">🥉</div><div class="font-bold">${s.winners.professional}</div><div class="text-xs">Top Professional</div></div>
            </div>
          `;
          track.appendChild(slide);
        });
        sec.container.querySelector('#seasonPrev').onclick = ()=> move(-1);
        sec.container.querySelector('#seasonNext').onclick = ()=> move(1);
        function move(delta){ seasonIndex = (seasonIndex + delta + state.seasons.length)%state.seasons.length; track.style.transform = `translateX(-${seasonIndex*100}%)`; }
        track.style.transform='translateX(0)';
      }
      renderLB();
      // periodic demo updates
      const rt = setInterval(()=> { const i = Math.floor(Math.random()*state.leaderboard.length); state.leaderboard[i].points += Math.floor(Math.random()*20); renderLB(); }, 6000);
      root.addEventListener('remove', ()=> clearInterval(rt));
      return root;
    });

    // Rewards Page
    register('/rewards', () => {
      const root = el('div');
      const sec = section('Rewards Store');
      sec.container.insertAdjacentHTML('beforeend', `
        <div class="flex items-center justify-between flex-wrap gap-3 mt-2">
          <div class="text-sm text-slate-600">Redeem points for badges, certificates, vouchers, and more.</div>
          <div class="flex items-center gap-2">
            <label class="text-sm">Tier</label>
            <select id="rewardTier" class="bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
              <option>All</option><option>Bronze</option><option>Silver</option><option>Gold</option><option>Platinum</option>
            </select>
            <input id="rewardSearch" type="search" placeholder="Search rewards..." class="bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
          </div>
        </div>
        <div id="rewardGrid" class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>
        <div class="mt-10 p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
          <div class="flex items-center justify-between"><h3 class="font-bold text-xl">Admin: Manage Rewards (Demo)</h3><span class="text-xs text-slate-500">Visible in Admin role</span></div>
          <div id="adminPanel" class="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3"></div>
        </div>
      `);
      root.appendChild(sec.wrap);

      function renderRewards(){
        const tier = sec.container.querySelector('#rewardTier').value;
        const q = (sec.container.querySelector('#rewardSearch').value||'').toLowerCase();
        const grid = sec.container.querySelector('#rewardGrid'); grid.innerHTML='';
        state.rewards.filter(r => (tier==='All'||r.tier===tier)).filter(r => !q || r.name.toLowerCase().includes(q)||r.desc.toLowerCase().includes(q)).forEach(r=>{
          const card = el('div','p-4 bg-white border border-slate-200 rounded-2xl soft-shadow hover-float');
          card.innerHTML = `
            <div class="flex items-center justify-between"><span class="badge ${r.tier==='Bronze'?'bg-amber-100 text-amber-800 border border-amber-200': r.tier==='Silver'?'bg-slate-100 text-slate-800 border border-slate-200': r.tier==='Gold'?'bg-yellow-100 text-yellow-800 border border-yellow-200':'bg-purple-100 text-purple-800 border border-purple-200'}">${r.tier}</span><span class="text-2xl">${rewardIcon(r.kind)}</span></div>
            <div class="mt-2 font-bold">${r.name}</div>
            <div class="text-sm text-slate-600">${r.desc}</div>
            <div class="mt-2 text-sm"><span class="font-semibold">${r.cost}</span> pts</div>
            <div class="mt-3 flex items-center gap-2">
              <button data-id="${r.id}" class="redeemBtn bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Redeem</button>
              <button class="bg-white text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-50 ring-focus" title="Preview">Preview</button>
            </div>
          `;
          grid.appendChild(card);
        });
        grid.querySelectorAll('.redeemBtn').forEach(b=> b.addEventListener('click', ()=> startRedeem(b.getAttribute('data-id'))));
      }
      function startRedeem(id){
        const item = state.rewards.find(x=>x.id===id); if (!item) return;
        if (state.user.points < item.cost) { alert('Not enough points yet. Keep earning!'); return; }
        if (!confirm(`Redeem "${item.name}" for ${item.cost} points?`)) return;
        state.user.points -= item.cost; persist(); celebrate();
        const token = 'ECO-' + uid().toUpperCase();
        if (item.kind==='certificate' || item.kind==='badge'){
          const w = window.open('', '_blank', 'noopener,noreferrer'); if (!w) return;
          w.document.write(`<html><head><title>${item.name} — EcoGamify</title><style>body{font-family:ui-sans-serif; padding:40px;} .cert{border:6px solid #10b981; padding:24px; border-radius:16px;} h1{color:#065f46} .token{font-family:monospace; background:#f1f5f9; padding:6px 10px; border-radius:8px; display:inline-block}</style></head><body><div class="cert"><h1>${item.name}</h1><p>Awarded to: ${state.user.name}</p><p>Institution: ${state.user.inst}, ${state.user.city}</p><p>Token: <span class="token">${token}</span></p><p>Issued by EcoGamify • Govt of Punjab (SIH)</p><button onclick="window.print()">Print / Save as PDF</button></div></body></html>`);
          w.document.close();
        } else {
          alert(`Success! Your redeem token: ${token}`);
        }
      }
      function renderAdminRewards(){
        const wrap = sec.container.querySelector('#adminPanel'); wrap.innerHTML='';
        if (state.user.role.toLowerCase()!=='admin'){ wrap.innerHTML='<div class="text-sm text-slate-600">Switch to Admin role to manage rewards.</div>'; return; }
        wrap.innerHTML = `
          <form id="rewardForm" class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div class="font-bold mb-2">Add Reward</div>
            <div class="grid grid-cols-2 gap-2">
              <input id="aName" placeholder="Name" class="bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
              <select id="aTier" class="bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus"><option>Bronze</option><option>Silver</option><option>Gold</option><option>Platinum</option></select>
              <input id="aCost" type="number" min="1" placeholder="Cost" class="bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
              <select id="aKind" class="bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus"><option value="badge">Badge</option><option value="certificate">Certificate</option><option value="voucher">Voucher</option><option value="trophy">Trophy</option><option value="merch">Merch</option></select>
            </div>
            <textarea id="aDesc" rows="2" class="mt-2 w-full bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus" placeholder="Description"></textarea>
            <div class="mt-2 flex items-center gap-2">
              <button class="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Add</button>
              <span id="adminMsg" class="text-sm font-semibold"></span>
            </div>
          </form>
        `;
        wrap.querySelector('#rewardForm').addEventListener('submit',(e)=>{
          e.preventDefault();
          const name = wrap.querySelector('#aName').value.trim();
          const tier = wrap.querySelector('#aTier').value;
          const cost = Number(wrap.querySelector('#aCost').value);
          const kind = wrap.querySelector('#aKind').value;
          const desc = wrap.querySelector('#aDesc').value.trim();
          if (!name || !cost){ wrap.querySelector('#adminMsg').textContent='Please fill all fields'; wrap.querySelector('#adminMsg').className='text-sm font-semibold text-rose-700'; return; }
          state.rewards.push({ id: uid(), tier, name, cost, desc, kind });
          wrap.querySelector('#adminMsg').textContent='Added ✓'; wrap.querySelector('#adminMsg').className='text-sm font-semibold text-emerald-700';
          e.target.reset(); renderRewards();
        });
      }
      sec.container.querySelector('#rewardTier').addEventListener('change', renderRewards);
      sec.container.querySelector('#rewardSearch').addEventListener('input', renderRewards);
      renderRewards(); renderAdminRewards();
      return root;
    });

    // Profile Page
    register('/profile', () => {
      const root = el('div');
      const sec = section('Profile & Dashboard');
      sec.container.insertAdjacentHTML('beforeend', `
        <div class="text-xs text-slate-500 mt-1">Auth-required in production — demo mode enabled (no password fields here).</div>
        <div class="mt-6 grid lg:grid-cols-3 gap-6">
          <div class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="w-20 h-20 rounded-full bg-emerald-100 grid place-items-center text-2xl overflow-hidden" id="avatarWrap" aria-label="Avatar"><span id="avatarEmoji">🧑‍🎓</span><img id="avatarImg" alt="Profile picture" class="hidden w-full h-full object-cover" /></div>
                <button id="btnUploadPic" class="absolute -bottom-2 -right-2 bg-white border border-slate-200 rounded-full p-1.5 text-slate-600 hover:bg-slate-50 ring-focus" title="Upload picture">📷</button>
                <input id="filePic" type="file" accept="image/*" class="hidden">
              </div>
              <div>
                <div class="font-extrabold" id="userName">${state.user.name}</div>
                <div class="text-sm text-slate-600" id="userRole">${state.user.role}</div>
                <div class="text-xs text-slate-500" id="userInst">${state.user.inst} • ${state.user.city}</div>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-3 gap-2">
              <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center"><div class="text-xs text-slate-600">Points</div><div id="uPts" class="font-extrabold text-emerald-700">${state.user.points}</div></div>
              <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center"><div class="text-xs text-slate-600">Level</div><div id="uLvl" class="font-extrabold text-emerald-700">${state.user.level}</div></div>
              <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center"><div class="text-xs text-slate-600">Streak</div><div id="uStr" class="font-extrabold text-emerald-700">${state.user.streak}</div></div>
            </div>
            <div class="mt-4">
              <h4 class="font-bold">Privacy</h4>
              <label class="mt-2 flex items-center gap-2 text-sm"><input id="hideName" type="checkbox" class="accent-emerald-600" ${state.user.hideName?'checked':''}>Hide full name on public leaderboards (use nickname)</label>
              <div class="mt-2"><label class="text-sm" for="nickname">Nickname</label><input id="nickname" class="w-full mt-1 bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus" placeholder="EcoWarrior…" maxlength="20" value="${state.user.nickname||''}"></div>
              <div class="mt-2 text-xs text-slate-500">Note: Demo-only. This affects local view of your row.</div>
            </div>
            <div class="mt-4">
              <h4 class="font-bold">Quick Actions</h4>
              <div class="mt-2 grid grid-cols-2 gap-2">
                <a href="#/leaderboard" class="bg-white text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-50 ring-focus text-center">View Leaderboard</a>
                <a href="#/rewards" class="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 ring-focus text-center">Redeem Rewards</a>
                <button id="btnUploadProof" class="bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 ring-focus col-span-2">Upload Task Proof</button>
              </div>
            </div>
          </div>

          <div class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <h4 class="font-bold">Edit Profile</h4>
            <form id="profileForm" class="mt-3 grid grid-cols-1 gap-3">
              <div><label class="text-sm" for="fName">Full Name</label><input id="fName" class="w-full mt-1 bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus" value="${state.user.name}"></div>
              <div><label class="text-sm" for="fInst">Institution</label><input id="fInst" class="w-full mt-1 bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus" value="${state.user.inst}"></div>
              <div class="grid grid-cols-2 gap-2">
                <div><label class="text-sm" for="fCity">City</label><input id="fCity" class="w-full mt-1 bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus" value="${state.user.city}"></div>
                <div><label class="text-sm" for="fState">State</label><input id="fState" class="w-full mt-1 bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus" value="${state.user.state}"></div>
              </div>
              <div class="p-3 bg-amber-50 border border-amber-100 rounded text-sm text-amber-800">Change password isn’t available in this demo. We’ll wire secure auth later.</div>
              <div class="flex items-center gap-2"><button class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Save</button><span id="profileMsg" class="text-sm font-semibold"></span></div>
            </form>
          </div>

          <div class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <div class="flex items-center justify-between"><h4 class="font-bold">Activity Feed</h4><button id="clearFeed" class="text-xs text-rose-700 hover:underline ring-focus">Clear</button></div>
            <ul id="activityFeed" class="mt-3 space-y-2 text-sm"></ul>
            <div class="mt-5"><h4 class="font-bold">Badges</h4><div id="badgeGrid" class="mt-2 grid grid-cols-5 gap-2"></div></div>
            <div class="mt-5 p-3 bg-sky-50 border border-sky-100 rounded-lg">
              <div class="text-sm font-bold text-sky-800">Offline Proofs</div>
              <div class="text-xs text-slate-600 mt-1">If offline, uploads are cached locally. Sync when back online.</div>
              <div class="mt-2 flex items-center gap-2"><button id="syncProofs" class="bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 ring-focus">Sync Now</button><span id="syncMsg" class="text-sm font-semibold"></span></div>
            </div>
          </div>
        </div>
      `);
      root.appendChild(sec.wrap);

      // Bind profile actions
      const filePic = sec.container.querySelector('#filePic');
      sec.container.querySelector('#btnUploadPic').addEventListener('click', ()=> filePic.click());
      filePic.addEventListener('change',(e)=>{
        const file = e.target.files[0]; if(!file) return;
        const reader=new FileReader(); reader.onload = function(){
          const img=new Image(); img.onload=function(){
            const size=Math.min(img.width,img.height), sx=(img.width-size)/2, sy=(img.height-size)/2;
            const c=document.createElement('canvas'); c.width=256; c.height=256; const ctx=c.getContext('2d'); ctx.imageSmoothingQuality='high';
            ctx.drawImage(img,sx,sy,size,size,0,0,256,256);
            const url = c.toDataURL('image/png'); state.user.avatar=url; persist();
            const avatarImg=sec.container.querySelector('#avatarImg'); avatarImg.src=url; avatarImg.onerror=function(){ this.src=''; this.alt='Image failed to load'; this.style.display='none'; };
            avatarImg.classList.remove('hidden'); sec.container.querySelector('#avatarEmoji').classList.add('hidden');
            pushActivity('Profile picture updated'); renderFeed(); 
          }; img.src = reader.result;
        }; reader.readAsDataURL(file);
      });
      sec.container.querySelector('#profileForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        state.user.name = sec.container.querySelector('#fName').value.trim()||state.user.name;
        state.user.inst = sec.container.querySelector('#fInst').value.trim()||state.user.inst;
        state.user.city = sec.container.querySelector('#fCity').value.trim()||state.user.city;
        state.user.state = sec.container.querySelector('#fState').value.trim()||state.user.state;
        sec.container.querySelector('#userName').textContent = state.user.name;
        sec.container.querySelector('#userInst').textContent = `${state.user.inst} • ${state.user.city}`;
        sec.container.querySelector('#profileMsg').textContent='Saved ✓'; sec.container.querySelector('#profileMsg').className='text-sm font-semibold text-emerald-700';
        pushActivity('Profile updated'); persist();
      });
      sec.container.querySelector('#hideName').addEventListener('change',(e)=>{ state.user.hideName=e.target.checked; persist(); });
      sec.container.querySelector('#nickname').addEventListener('input',(e)=>{ state.user.nickname=e.target.value; persist(); });

      sec.container.querySelector('#btnUploadProof').addEventListener('click', ()=>{
        if (!navigator.onLine){ state.offlineProofs = state.offlineProofs||[]; state.offlineProofs.push({ id: uid(), note:'Proof while offline', ts: Date.now() }); sec.container.querySelector('#syncMsg').textContent='Saved offline ✓'; sec.container.querySelector('#syncMsg').className='text-sm font-semibold text-emerald-700'; pushActivity('Proof cached offline'); renderFeed(); }
        else { alert('Demo: Proof uploaded (no backend).'); pushActivity('Proof uploaded'); renderFeed(); }
      });
      sec.container.querySelector('#syncProofs').addEventListener('click', ()=>{
        const arr = state.offlineProofs||[]; if (arr.length===0){ sec.container.querySelector('#syncMsg').textContent='Nothing to sync'; sec.container.querySelector('#syncMsg').className='text-sm font-semibold text-slate-600'; return; }
        const count=arr.length; state.offlineProofs=[]; sec.container.querySelector('#syncMsg').textContent=`Synced ${count} item(s) ✓`; sec.container.querySelector('#syncMsg').className='text-sm font-semibold text-emerald-700'; pushActivity(`Synced ${count} offline proof(s)`); renderFeed();
      });
      sec.container.querySelector('#clearFeed').addEventListener('click',()=>{ state.activity=[]; renderFeed(); });

      function pushActivity(text){ state.activity.unshift({ id: uid(), text, ts: Date.now() }); }
      function renderFeed(){
        const list = sec.container.querySelector('#activityFeed'); list.innerHTML='';
        state.activity.slice(0,8).forEach(a=>{ const li=el('li','p-3 bg-slate-50 border border-slate-200 rounded-lg'); li.textContent=a.text; list.appendChild(li); });
        const grid = sec.container.querySelector('#badgeGrid'); grid.innerHTML='';
        const count = Math.max(1, state.user.badges);
        for(let i=0;i<count;i++){ const cell=el('div','aspect-square rounded-lg border border-emerald-200 bg-emerald-50 grid place-items-center text-2xl'); cell.textContent='🏅'; grid.appendChild(cell); }
      }
      renderFeed();
      return root;
    });

    // Institutions Page
    register('/institutions', () => {
      const root = el('div');
      const sec = section('Institutions & Government');
      sec.container.insertAdjacentHTML('beforeend', `
        <div class="mt-4 grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <h3 class="font-bold text-xl">Onboarding & Benefits</h3>
            <ul class="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Simple onboarding for schools/colleges</li>
              <li>• Bulk user import (CSV)</li>
              <li>• School leaderboard and teacher approvals</li>
              <li>• Exportable analytics for institutions and govt</li>
              <li>• Policy alignment dashboards (NEP 2020, SDGs)</li>
            </ul>
            <div class="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 class="font-bold">Sample Impact Report</h4>
              <p class="text-sm text-slate-600">Open and print to save as PDF.</p>
              <button id="openImpactReport" class="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Open Report</button>
            </div>
          </div>
          <aside class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <h4 class="font-bold">Govt Dashboards</h4>
            <ul class="mt-3 text-sm text-slate-700 space-y-2">
              <li>• State-level summaries</li>
              <li>• Season reports</li>
              <li>• Policy alignment insights</li>
            </ul>
            <div class="mt-3"><a href="#/leaderboard" class="bg-white text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-50 ring-focus inline-block">View Rankings</a></div>
          </aside>
        </div>
      `);
      root.appendChild(sec.wrap);
      sec.container.querySelector('#openImpactReport').addEventListener('click', ()=>{
        const w = window.open('', '_blank', 'noopener,noreferrer'); if(!w) return;
        w.document.write(`<html><head><title>Sample Impact Report</title><style>body{font-family:ui-sans-serif; padding:40px;} h1{color:#065f46}</style></head><body><h1>EcoGamify — Sample Impact Report</h1><p>Institution: Punjab Engineering College</p><ul><li>Trees planted: 12,340</li><li>Plastic saved: 2,140 kg</li><li>Energy conserved: 38,200 kWh</li></ul><button onclick="window.print()">Print / Save as PDF</button></body></html>`);
        w.document.close();
      });
      return root;
    });

    // Impact Page
    register('/impact', () => {
      const root = el('div');
      const sec = section('Impact');
      sec.container.insertAdjacentHTML('beforeend', `
        <div class="mt-6 grid sm:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-100"><div class="text-sm text-emerald-800">Trees planted</div><div id="impactTrees" class="text-2xl font-extrabold text-emerald-700">0</div><div class="h-2 bg-emerald-100 rounded mt-2"><div id="impactTreesBar" class="h-2 bg-emerald-600 rounded" style="width:0%"></div></div></div>
          <div class="p-4 rounded-xl bg-sky-50 border border-sky-100"><div class="text-sm text-sky-800">Plastic saved (kg)</div><div id="impactPlastic" class="text-2xl font-extrabold text-sky-700">0</div><div class="h-2 bg-sky-100 rounded mt-2"><div id="impactPlasticBar" class="h-2 bg-sky-600 rounded" style="width:0%"></div></div></div>
          <div class="p-4 rounded-xl bg-amber-50 border border-amber-100"><div class="text-sm text-amber-800">Energy conserved (kWh)</div><div id="impactEnergy" class="text-2xl font-extrabold text-amber-700">0</div><div class="h-2 bg-amber-100 rounded mt-2"><div id="impactEnergyBar" class="h-2 bg-amber-500 rounded" style="width:0%"></div></div></div>
        </div>
        <div class="mt-8 p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
          <h3 class="font-bold text-xl">Testimonials</h3>
          <div class="mt-3 overflow-hidden"><div id="testiTrack" class="carousel-track"></div>
            <div class="flex items-center justify-center gap-2 mt-3"><button id="testiPrev" class="px-2 py-1 bg-white border border-slate-200 rounded ring-focus">‹</button><button id="testiNext" class="px-2 py-1 bg-white border border-slate-200 rounded ring-focus">›</button></div>
          </div>
        </div>
        <div class="mt-8 p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
          <h3 class="font-bold text-xl">SDG Alignment Progress</h3>
          <div class="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl"><div class="text-sm">SDG 4: Quality Education</div><div class="h-2 bg-slate-200 rounded mt-2"><div class="h-2 bg-emerald-500 rounded" style="width:74%"></div></div></div>
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl"><div class="text-sm">SDG 11: Sustainable Cities</div><div class="h-2 bg-slate-200 rounded mt-2"><div class="h-2 bg-emerald-500 rounded" style="width:62%"></div></div></div>
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl"><div class="text-sm">SDG 12: Responsible Consumption</div><div class="h-2 bg-slate-200 rounded mt-2"><div class="h-2 bg-emerald-500 rounded" style="width:58%"></div></div></div>
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl"><div class="text-sm">SDG 13: Climate Action</div><div class="h-2 bg-slate-200 rounded mt-2"><div class="h-2 bg-emerald-500 rounded" style="width:69%"></div></div></div>
          </div>
        </div>
      `);
      root.appendChild(sec.wrap);
      // counters
      const t = state.impact;
      sec.container.querySelector('#impactTrees').textContent = t.trees.toLocaleString('en-IN');
      sec.container.querySelector('#impactPlastic').textContent = t.plastic.toLocaleString('en-IN');
      sec.container.querySelector('#impactEnergy').textContent = t.energy.toLocaleString('en-IN');
      sec.container.querySelector('#impactTreesBar').style.width = Math.min(100, t.trees/1000)+'%';
      sec.container.querySelector('#impactPlasticBar').style.width = Math.min(100, t.plastic/200)+'%';
      sec.container.querySelector('#impactEnergyBar').style.width = Math.min(100, t.energy/5000)+'%';
      // testimonials
      const track = sec.container.querySelector('#testiTrack'); let idx=0;
      state.testimonials.forEach(m=>{ const s=el('div','min-w-full p-4'); s.innerHTML=`<div class="p-5 bg-white border border-slate-200 rounded-xl"><div class="text-lg">“${m.text}”</div><div class="mt-2 text-sm text-slate-600">— ${m.who}</div></div>`; track.appendChild(s); });
      function move(d){ idx=(idx+d+state.testimonials.length)%state.testimonials.length; track.style.transform = `translateX(-${idx*100}%)`; }
      sec.container.querySelector('#testiPrev').addEventListener('click',()=>move(-1));
      sec.container.querySelector('#testiNext').addEventListener('click',()=>move(1));
      return root;
    });

    // Team Page
    register('/team', () => {
      const root = el('div');
      const sec = section('Meet Our Founders & Team');
      sec.container.insertAdjacentHTML('beforeend', `
        <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-5 bg-white border border-emerald-200 rounded-2xl soft-shadow hover-float"><div class="text-5xl">👨‍💼</div><div class="mt-2 font-extrabold text-emerald-800">Tanuj Rawat</div><div class="text-sm text-slate-600">CEO & Founder</div><div class="mt-2 text-xs text-slate-600">Leads vision, partnerships, and SIH collaboration.</div></div>
          <div class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow hover-float group"><div class="text-4xl">🧑‍💼</div><div class="mt-2 font-bold">Prince Verma</div><div class="text-sm text-slate-600">Co-Founder</div><div class="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-600 mt-2">Strategy and institutional relations.</div></div>
          <div class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow hover-float group"><div class="text-4xl">🧑‍💻</div><div class="mt-2 font-bold">Rishabh Yaduvanshi</div><div class="text-sm text-slate-600">Tech Lead</div><div class="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-600 mt-2">Architecture & performance.</div></div>
          <div class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow hover-float group"><div class="text-4xl">👨‍💻</div><div class="mt-2 font-bold">Deepak Kumar</div><div class="text-sm text-slate-600">Backend Developer</div><div class="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-600 mt-2">APIs, auth, and data models.</div></div>
          <div class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow hover-float group"><div class="text-4xl">🎨</div><div class="mt-2 font-bold">Roshan Kumar</div><div class="text-sm text-slate-600">UI/UX Designer</div><div class="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-600 mt-2">Design systems & accessibility.</div></div>
          <div class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow hover-float group"><div class="text-4xl">📝</div><div class="mt-2 font-bold">Purvi Verma</div><div class="text-sm text-slate-600">Content & Community Manager</div><div class="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-600 mt-2">Curriculum & community programs.</div></div>
        </div>
      `);
      root.appendChild(sec.wrap);
      return root;
    });

    // Blog / Resources Page
    register('/blog', () => {
      const root = el('div');
      const sec = section('Blog & Resources');
      sec.container.insertAdjacentHTML('beforeend', `
        <form id="newsletter" class="mt-2 flex items-center gap-2" aria-label="Newsletter signup">
          <input id="nlEmail" type="email" required placeholder="Your email" class="bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus" />
          <button class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Subscribe</button>
          <span class="text-xs text-slate-500">Earn 50 points on subscribe</span>
        </form>
        <div id="blogGrid" class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
      `);
      root.appendChild(sec.wrap);

      const grid = sec.container.querySelector('#blogGrid'); grid.innerHTML='';
      state.posts.forEach(p=>{
        const card = el('article','p-4 bg-white border border-slate-100 rounded-xl soft-shadow hover-float');
        card.innerHTML = `<div class="badge bg-emerald-50 text-emerald-700 border border-emerald-200">${p.tag}</div><h3 class="mt-2 font-bold">${p.title}</h3><p class="text-sm text-slate-600 mt-1">SEO-friendly resource for India-specific eco learning.</p><a href="https://example.com" target="_blank" rel="noopener noreferrer" class="mt-2 inline-block text-emerald-700 hover:underline">Read →</a>`;
        grid.appendChild(card);
      });

      sec.container.querySelector('#newsletter').addEventListener('submit',(e)=>{
        e.preventDefault();
        const email = sec.container.querySelector('#nlEmail').value.trim();
        if (!email) return;
        state.user.points += 50; persist();
        alert('Thanks for subscribing! +50 points awarded (demo).');
        sec.container.querySelector('#nlEmail').value='';
      });
      return root;
    });

    // Contact Page (official)
    register('/contact', () => {
      const root = el('div');
      const sec = section('Contact / Join');
      sec.container.insertAdjacentHTML('beforeend', `
        <div class="mt-6 grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <div class="grid sm:grid-cols-3 gap-4">
              <div><div class="text-sm text-slate-500">Address</div><div class="font-semibold">Government of Punjab</div></div>
              <div><div class="text-sm text-slate-500">Phone</div><div class="font-semibold">+91 98XXXXXXXX</div></div>
              <div><div class="text-sm text-slate-500">Email</div><a href="mailto:support@ecogamify.in" class="font-semibold text-emerald-700 hover:underline">support@ecogamify.in</a></div>
            </div>
            <form id="contactForm" class="mt-6 grid gap-3">
              <div class="grid sm:grid-cols-2 gap-3">
                <div><label class="text-sm" for="cName">Name</label><input id="cName" required class="w-full mt-1 bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus"></div>
                <div><label class="text-sm" for="cEmail">Email</label><input id="cEmail" type="email" required class="w-full mt-1 bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus"></div>
              </div>
              <div><label class="text-sm" for="cMsg">Message</label><textarea id="cMsg" required rows="4" class="w-full mt-1 bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus"></textarea></div>
              <div class="flex items-center gap-2"><button class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Send</button><span id="contactMsg" class="text-sm font-semibold"></span></div>
            </form>
          </div>
          <aside class="p-5 bg-white border border-slate-100 rounded-2xl soft-shadow">
            <h3 class="font-bold">Punjab Map (Placeholder)</h3>
            <svg viewBox="0 0 200 160" role="img" aria-label="Punjab map placeholder" class="w-full mt-3">
              <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#bbf7d0"/><stop offset="100%" stop-color="#bae6fd"/></linearGradient></defs>
              <rect x="10" y="10" width="180" height="140" rx="16" fill="url(#g)" stroke="#22c55e" stroke-width="2"/>
              <circle cx="60" cy="60" r="6" fill="#065f46"/><text x="68" y="64" font-size="10" fill="#065f46">Chandigarh</text>
              <circle cx="140" cy="80" r="6" fill="#065f46"/><text x="148" y="84" font-size="10" fill="#065f46">Amritsar</text>
            </svg>
          </aside>
        </div>
      `);
      root.appendChild(sec.wrap);
      sec.container.querySelector('#contactForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        const name = sec.container.querySelector('#cName').value.trim();
        const email = sec.container.querySelector('#cEmail').value.trim();
        const msg = sec.container.querySelector('#cMsg').value.trim();
        if (!name || !email || !msg) return;
        sec.container.querySelector('#contactMsg').textContent='Sent ✓ (demo)'; sec.container.querySelector('#contactMsg').className='text-sm font-semibold text-emerald-700';
        setTimeout(()=> sec.container.querySelector('#contactMsg').textContent='', 1500);
      });
      return root;
    });

    // Admin Panel Page (role-based)
    register('/admin', () => {
      const root = el('div');
      const sec = section('Admin Panel');
      if (state.user.role.toLowerCase()!=='admin'){
        const box = el('div','mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800');
        box.textContent = 'Admin access required. Switch to Admin role from the top bar (demo).';
        sec.container.appendChild(box);
        root.appendChild(sec.wrap);
        return root;
      }
      sec.container.insertAdjacentHTML('beforeend', `
        <div class="mt-2 grid lg:grid-cols-4 gap-4">
          <div class="p-4 bg-white border border-slate-100 rounded-xl soft-shadow">
            <h3 class="font-bold">Quick Toggles</h3>
            <label class="mt-3 flex items-center gap-2 text-sm"><input id="admPunjabDefault" type="checkbox" class="accent-emerald-600" ${state.ui.punjabDefault?'checked':''}>Punjab as default leaderboard view</label>
            <button id="admExportAnalytics" class="mt-3 w-full bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Export Analytics (CSV)</button>
          </div>
          <div class="lg:col-span-3 p-4 bg-white border border-slate-100 rounded-xl soft-shadow">
            <div class="flex flex-wrap items-center gap-2">
              <button data-tab="users" class="tab px-3 py-2 rounded-lg bg-emerald-600 text-white">Manage Users</button>
              <button data-tab="proofs" class="tab px-3 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-700">Verify Proofs</button>
              <button data-tab="seasons" class="tab px-3 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-700">Edit Seasons</button>
              <button data-tab="rewards" class="tab px-3 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-700">Manage Rewards</button>
            </div>
            <div id="admView" class="mt-4"></div>
          </div>
        </div>
      `);
      root.appendChild(sec.wrap);

      const admView = sec.container.querySelector('#admView');
      function renderUsers(){
        admView.innerHTML = `
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-slate-50 text-slate-600"><tr><th class="text-left px-3 py-2">Name</th><th class="text-left px-3 py-2">Role</th><th class="text-left px-3 py-2">Institution</th><th class="text-left px-3 py-2">City</th><th class="text-right px-3 py-2">Points</th><th class="text-left px-3 py-2">Status</th><th class="text-left px-3 py-2">Actions</th></tr></thead>
              <tbody id="admUsers"></tbody>
            </table>
          </div>
        `;
        const body = admView.querySelector('#admUsers');
        body.innerHTML='';
        state.users.forEach(u=>{
          const tr=el('tr','border-t border-slate-100');
          tr.innerHTML = `
            <td class="px-3 py-2">${u.name}</td>
            <td class="px-3 py-2"><select data-id="${u.id}" class="admRole bg-white border border-slate-300 rounded px-2 py-1 text-sm"><option ${u.role==='Student'?'selected':''}>Student</option><option ${u.role==='Teacher'?'selected':''}>Teacher</option><option ${u.role==='NGO'?'selected':''}>NGO</option><option ${u.role==='Admin'?'selected':''}>Admin</option></select></td>
            <td class="px-3 py-2">${u.inst}</td>
            <td class="px-3 py-2">${u.city}</td>
            <td class="px-3 py-2 text-right font-semibold">${u.points.toLocaleString('en-IN')}</td>
            <td class="px-3 py-2">${u.active?'<span class="badge bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>':'<span class="badge bg-slate-100 text-slate-800 border border-slate-200">Inactive</span>'}</td>
            <td class="px-3 py-2"><button data-id="${u.id}" class="admToggle bg-white border border-slate-200 rounded px-2 py-1 text-sm hover:bg-slate-50 ring-focus">${u.active?'Deactivate':'Activate'}</button></td>
          `;
          body.appendChild(tr);
        });
        body.querySelectorAll('.admRole').forEach(sel=>{
          sel.addEventListener('change', ()=>{
            const u = state.users.find(x=>x.id===sel.getAttribute('data-id')); if (!u) return;
            u.role = sel.value;
            alert(`Updated role for ${u.name} → ${u.role} (demo)`);
          });
        });
        body.querySelectorAll('.admToggle').forEach(btn=>{
          btn.addEventListener('click', ()=>{
            const u = state.users.find(x=>x.id===btn.getAttribute('data-id')); if (!u) return;
            u.active = !u.active; renderUsers();
          });
        });
      }

      function renderProofs(){
        admView.innerHTML = `<div id="proofList" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"></div>`;
        const list = admView.querySelector('#proofList'); list.innerHTML='';
        state.tasks.filter(t=>t.status!=='Approved').forEach(t=>{
          const card = el('div','p-4 bg-slate-50 border border-slate-200 rounded-xl');
          card.innerHTML = `
            <div class="font-bold">${t.title}</div>
            <div class="text-xs text-slate-600">${t.category} • ${t.city}, ${t.state} • ${t.user}</div>
            <div class="mt-2 flex items-center gap-2">
              <button data-id="${t.id}" data-action="approve" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 ring-focus">Approve</button>
              <button data-id="${t.id}" data-action="reject" class="px-3 py-1.5 bg-white text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-50 ring-focus">Reject</button>
              <button class="ml-auto px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 ring-focus">Preview Proof</button>
            </div>
          `;
          list.appendChild(card);
        });
        list.querySelectorAll('button').forEach(b=>{
          b.addEventListener('click', ()=>{
            const id=b.getAttribute('data-id'); const act=b.getAttribute('data-action'); const t=state.tasks.find(x=>x.id===id); if(!t) return;
            if(act==='approve'){ t.status='Approved'; celebrate(); }
            if(act==='reject'){ t.status='Rejected'; }
            renderProofs();
          });
        });
      }

      function renderSeasons(){
        admView.innerHTML = `
          <div class="grid lg:grid-cols-2 gap-3">
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl"><h4 class="font-bold">Current Seasons</h4><ul id="seasonList" class="mt-2 space-y-2"></ul></div>
            <form id="seasonForm" class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 class="font-bold">Add / Edit Season</h4>
              <input id="sCode" placeholder="Code (e.g., S2-2025)" class="w-full mt-2 bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
              <input id="sLabel" placeholder="Label (e.g., Season 2: Apr–Jun 2025)" class="w-full mt-2 bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
              <div class="grid grid-cols-3 gap-2 mt-2">
                <input id="sSchool" placeholder="Top School" class="bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
                <input id="sCollege" placeholder="Top College" class="bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
                <input id="sProf" placeholder="Top Professional" class="bg-white border border-slate-300 rounded-lg px-3 py-2 ring-focus">
              </div>
              <button class="mt-3 bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 ring-focus">Save Season</button>
              <span id="seasonMsg" class="text-sm font-semibold ml-2"></span>
            </form>
          </div>
        `;
        const list = admView.querySelector('#seasonList'); list.innerHTML='';
        state.seasons.forEach(s=>{
          const li = el('li','p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between');
          li.innerHTML = `<div><div class="font-bold">${s.label}</div><div class="text-xs text-slate-600">${s.winners.school} • ${s.winners.college} • ${s.winners.professional}</div></div><button data-code="${s.code}" class="text-rose-700 hover:underline">Remove</button>`;
          list.appendChild(li);
        });
        list.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=>{
          const code=b.getAttribute('data-code'); state.seasons = state.seasons.filter(x=>x.code!==code); renderSeasons();
        }));
        admView.querySelector('#seasonForm').addEventListener('submit',(e)=>{
          e.preventDefault();
          const code=admView.querySelector('#sCode').value.trim(); const label=admView.querySelector('#sLabel').value.trim();
          const school=admView.querySelector('#sSchool').value.trim(); const college=admView.querySelector('#sCollege').value.trim(); const prof=admView.querySelector('#sProf').value.trim();
          if(!code||!label) { admView.querySelector('#seasonMsg').textContent='Missing fields'; admView.querySelector('#seasonMsg').className='text-sm font-semibold text-rose-700 ml-2'; return; }
          state.seasons.push({ code, label, winners:{ school, college, professional: prof }, stats:'—' }); admView.querySelector('#seasonMsg').textContent='Saved ✓'; admView.querySelector('#seasonMsg').className='text-sm font-semibold text-emerald-700 ml-2';
          renderSeasons();
        });
      }

      function renderRewards(){
        admView.innerHTML = `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" id="admRewards"></div>`;
        const wrap = admView.querySelector('#admRewards');
        state.rewards.forEach(r=>{
          const card=el('div','p-4 bg-slate-50 border border-slate-200 rounded-xl');
          card.innerHTML = `<div class="text-2xl">${rewardIcon(r.kind)}</div><div class="font-bold mt-1">${r.name}</div><div class="text-xs text-slate-600">${r.tier} • ${r.cost} pts</div><div class="text-xs text-slate-600">${r.desc}</div><div class="mt-2 flex items-center gap-2"><button data-id="${r.id}" class="bg-white border border-slate-200 rounded px-2 py-1 text-sm hover:bg-slate-50 ring-focus">Remove</button></div>`;
          wrap.appendChild(card);
        });
        wrap.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=>{
          const id=b.getAttribute('data-id'); state.rewards = state.rewards.filter(x=>x.id!==id); renderRewards();
        }));
      }

      // Tabs
      const tabs = sec.container.querySelectorAll('.tab');
      tabs.forEach(btn=> btn.addEventListener('click', ()=>{
        tabs.forEach(x=> x.className='tab px-3 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-700');
        btn.className='tab px-3 py-2 rounded-lg bg-emerald-600 text-white';
        const tab = btn.getAttribute('data-tab');
        if (tab==='users') renderUsers();
        if (tab==='proofs') renderProofs();
        if (tab==='seasons') renderSeasons();
        if (tab==='rewards') renderRewards();
      }));
      renderUsers();

      // Quick toggles
      sec.container.querySelector('#admPunjabDefault').addEventListener('change',(e)=>{ state.ui.punjabDefault = e.target.checked; persist(); alert('Default leaderboard view updated.'); });
      sec.container.querySelector('#admExportAnalytics').addEventListener('click', ()=>{
        const rows = [['Metric','Value'], ['Students', state.counters.students], ['Tasks', state.counters.tasks], ['Trees', state.impact.trees]];
        const csv = rows.map(r=>r.join(',')).join('\n'); const blob = new Blob([csv], { type:'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='ecogamify_analytics_demo.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
      });
      return root;
    });

    // 404
    register('/404', () => {
      const root = el('div');
      const sec = section('Page Not Found');
      sec.container.insertAdjacentHTML('beforeend', `<p class="mt-2 text-slate-600">The page you requested doesn’t exist. Go back to <a href="#/" class="text-emerald-700 hover:underline">Home</a>.</p>`);
      root.appendChild(sec.wrap);
      return root;
    });

    // Initial route
    if (!location.hash) location.hash = '#/';
    onRoute();

    // Keyboard shortcut: focus search
    document.addEventListener('keydown', (e)=>{ if (e.key==='k' && (e.ctrlKey||e.metaKey)){ e.preventDefault(); document.getElementById('globalSearch').focus(); } });
 

    (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'98178923d0428590',t:'MTc1ODI2ODY4My4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();