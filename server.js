<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gravitas Bug Tracker</title>
    <!-- Tailwind CSS CDN --><script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts: VT323 --><link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=load" rel="stylesheet">
    <!-- Chart.js for Dashboard --><script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Marked.js for Markdown Parsing --><script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        /* All CSS from your working file is placed here */
        body {
            font-family: 'VT323', monospace;
            background-color: #000;
            color: white;
            /* Fix for blurry pixel font rendering */
            font-smooth: never;
            -webkit-font-smoothing: none;
            image-rendering: -webkit-optimize-contrast; /* old Chrome */
            image-rendering: crisp-edges; /* Firefox */
            image-rendering: pixelated; /* modern browsers */
            overflow-wrap: break-word; /* Prevents text overflow */
        }

        .text-shadow-heavy {
            text-shadow: 2px 2px 2px #000;
        }

        .ui-panel {
            background-color: rgba(30, 30, 30, 0.75);
            padding: 15px;
            border: 3px solid #333;
            border-top-color: #555;
            border-left-color: #555;
            box-shadow: inset 0 0 0 3px #111;
        }

        .gravitas-input {
            background-color: #111;
            border: 2px solid #333;
            color: white;
            font-family: 'VT323', monospace;
            padding: 5px;
            font-size: 20px;
            width: 100%;
        }

        .gravitas-button {
            background-color: #444;
            border: 2px solid #222;
            color: white;
            cursor: pointer;
            font-family: 'VT323', monospace;
            font-size: 20px;
            padding: 10px 15px;
            width: 100%;
            text-align: center;
            transition: background-color 0.2s;
        }

        .gravitas-button:hover {
            background-color: #666;
        }
        
        /* Custom select arrow for retro style */
        select.gravitas-input {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.5rem center;
            background-repeat: no-repeat;
            background-size: 1.5em 1.5em;
            padding-right: 2.5rem;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }

        .icon-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 2px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .icon-pixelated {
            filter: url(#pixelate);
        }

        .attachment-preview-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .attachment-preview {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border: 2px solid #555;
            margin-top: 8px;
            image-rendering: pixelated;
        }
        
        .remove-preview-btn {
            position: absolute;
            top: 0;
            right: -5px;
            background-color: rgba(200, 0, 0, 0.8);
            color: white;
            border: 1px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 14px;
            line-height: 18px;
            text-align: center;
            cursor: pointer;
        }
        .char-counter {
            font-size: 14px;
            color: #888;
            text-align: right;
        }
        
        .vote-button {
            background: none;
            border: none;
            color: white;
            padding: 2px;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .vote-button:hover {
            background: none;
            color: #aaa;
        }

        .vote-button.voted {
            background: none;
            color: #60a5fa;
        }

        #watch-btn.watching {
            background-color: #1d4ed8;
            border-color: #60a5fa;
        }

        .watching-bug {
            border-color: rgba(96, 165, 250, 0.5);
            background-color: rgba(29, 78, 216, 0.15);
        }

        .vote-count {
            font-size: 24px;
            text-shadow: 2px 2px 2px #000;
            min-width: 2rem; /* Keep layout stable */
            text-align: center;
        }

        @keyframes pulse-red {
          0%, 100% {
            box-shadow: 0 0 5px #ef4444, 0 0 10px #ef4444;
            background-color: #b91c1c;
          }
          50% {
            box-shadow: 0 0 15px #f87171, 0 0 25px #f87171;
            background-color: #dc2626;
          }
        }

        .status-urgent {
          background-color: #991b1b; /* dark red */
          animation: pulse-red 2s infinite;
        }

        @keyframes pulse-red-text {
          0%, 100% {
            text-shadow: 0 0 5px #ef4444, 0 0 10px #ef4444, 2px 2px 2px #000;
            color: #ef4444;
          }
          50% {
            text-shadow: 0 0 15px #f87171, 0 0 25px #f87171, 2px 2px 2px #000;
            color: #fca5a5;
          }
        }
        .glow-red-text {
          animation: pulse-red-text 2s infinite;
        }
        .feature-toggle-group {
            margin-bottom: 8px;
        }
        .feature-toggle-label {
            font-size: 18px;
            color: #aaa;
            margin-bottom: 4px;
            display: block;
        }
        .feature-toggle {
            background-color: #111;
            border: 2px solid #333;
            color: white;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 16px;
            margin-right: 6px;
            margin-bottom: 6px;
        }
        .feature-toggle.active {
            background-color: #1d4ed8;
            border-color: #60a5fa;
        }
        .mode-toggle.active {
            background-color: #1d4ed8;
            border-color: #60a5fa;
        }

        .truncate-3-lines {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .truncate-1-line {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Collapsible Form Styles */
        #bug-form-toggle {
            cursor: pointer;
            transition: margin-bottom 0.3s ease-in-out;
        }
        #bug-form {
            transition: opacity 0.3s ease-in-out, visibility 0s 0.3s, max-height 0.3s ease-in-out, margin-top 0.3s ease-in-out;
            max-height: 2000px; /* Large enough for content */
            overflow: hidden;
            opacity: 1;
            visibility: visible;
            margin-top: 1rem;
        }
        #bug-form-container.form-collapsed #bug-form {
            max-height: 0;
            opacity: 0;
            visibility: hidden;
            margin-top: 0;
        }
        #bug-form-container.form-collapsed #bug-form-toggle {
            text-align: center;
            margin-bottom: 0;
        }

        /* Easter Egg Styles */
        body.physics-active {
            overflow: hidden; /* Prevent scrollbars */
        }
        .physics-object {
            position: fixed; /* Use fixed to detach from scroll position */
            transform-origin: center center;
            will-change: transform;
            z-index: 100;
        }

        /* Markdown formatting styles */
        .markdown-content {
            white-space: pre-wrap; /* Respects newlines in all markdown content */
        }
        .markdown-content ul, .markdown-content ol {
            margin-left: 20px;
            list-style-position: inside;
            list-style-type: disc;
        }
         .markdown-content ol {
            list-style-type: decimal;
        }
        .markdown-content code {
             background-color: #111;
             padding: 2px 5px;
             border: 1px solid #333;
        }
        .markdown-content pre {
            background-color: #111;
            padding: 10px;
            border: 1px solid #333;
            overflow-x: auto;
            white-space: pre-wrap;
        }
        
        /* Activity Timeline & Scroll to Top Styles */
        #activity-timeline-btn {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            z-index: 1010; /* Above main content, below modals */
        }
        #scroll-to-top-btn {
            position: fixed;
            bottom: 5.5rem;
            right: 1rem;
            z-index: 1010;
        }
        .activity-item {
            font-size: 18px;
        }
        .activity-event {
            color: #888;
            padding: 8px 0;
            border-bottom: 2px solid #222;
        }

        /* Hamburger Styles */
        #nav-toggle-btn {
            background: none;
            border: none;
            padding: 0;
            transition: transform 0.3s ease-in-out; /* Add transition for smooth movement */
        }
        .hamburger-line {
            display: block;
            width: 100%;
            height: 5px;
            background-color: white;
            transition: all 0.3s ease-in-out;
            transform-origin: center;
            position: absolute;
            left: 0;
        }
        .line1 { top: 4px; }
        .line2 { top: 13.5px; } /* Centered precisely */
        .line3 { bottom: 4px; }

        #nav-toggle-btn.panel-open .line1 {
            top: 13.5px;
            transform: rotate(45deg);
        }
        #nav-toggle-btn.panel-open .line2 {
            opacity: 0;
        }
        #nav-toggle-btn.panel-open .line3 {
            bottom: 13.5px; /* Use bottom for perfect symmetry */
            transform: rotate(-45deg);
        }

    </style>
</head>
<body class="bg-black text-white">
    
    <!-- Navigation Toggle Button --><button id="nav-toggle-btn" class="fixed top-4 left-4 z-[1021] cursor-pointer">
        <div id="hamburger-icon" class="w-8 h-8 icon-pixelated relative">
            <span class="hamburger-line line1"></span>
            <span class="hamburger-line line2"></span>
            <span class="hamburger-line line3"></span>
        </div>
    </button>

    <!-- Navigation Panel --><div id="nav-panel" class="fixed top-0 left-0 h-full w-full max-w-xs bg-black/95 backdrop-blur-sm z-[1020] transition-transform duration-300 ease-in-out -translate-x-full ui-panel !border-r-4 !border-l-0 !border-t-0 !border-b-0">
        <div class="h-full flex flex-col p-4">
            <!-- Auth Container in Nav Panel --><div id="nav-auth-container" class="mb-8 flex-shrink-0">
                <!-- Login/Logout buttons will be injected here --></div>
            
            <!-- Navigation Links --><nav class="flex-grow">
                <ul class="space-y-2">
                    <li>
                        <button id="go-to-tracker-btn" class="gravitas-button !w-full !text-left">Bug Tracker</button>
                    </li>
                    <li>
                        <button id="go-to-suggestions-btn" class="gravitas-button !w-full !text-left">Game Suggestions</button>
                    </li>
                    <!-- More pages can be added here in the future --></ul>
            </nav>
        </div>
    </div>


    <!-- SVG Filter Definition for Pixelation Effect --><svg style="position:absolute; width:0; height:0;">
        <defs>
          <filter id="pixelate">
            <feGaussianBlur stdDeviation="0.8" in="SourceGraphic" result="blur" />
            <feComponentTransfer in="blur" result="pixelated">
              <feFuncA type="discrete" tableValues="0 1" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="pixelated"/>
            </feMerge>
          </filter>
        </defs>
    </svg>

    <!-- Bug Tracker Page --><div id="bug-tracker-page">
        <div class="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <header class="text-center mb-8">
                <div class="flex justify-center items-center mb-4">
                    <h1 class="font-bold text-white text-shadow-heavy" style="font-size: 52px;">
                        Gravitas Bug Tracker
                    </h1>
                </div>
            </header>
            <div id="dashboard" class="ui-panel mb-8">
                <h2 class="text-white text-shadow-heavy text-center" style="font-size: 30px; margin-bottom: 1rem;">Project Dashboard</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="ui-panel !bg-black/20">
                        <div id="resolved-bugs" class="text-5xl text-green-400 text-shadow-heavy">0</div>
                        <div class="text-xl text-slate-400">Resolved Bugs</div>
                    </div>
                    <div class="ui-panel !bg-black/20">
                        <div id="open-bugs" class="text-5xl text-yellow-400 text-shadow-heavy">0</div>
                        <div class="text-xl text-slate-400">Unresolved Bugs</div>
                    </div>
                    <div class="ui-panel !bg-black/20">
                        <div id="urgent-bugs" class="text-5xl text-red-500 text-shadow-heavy glow-red-text">0</div>
                        <div class="text-xl text-slate-400">Urgent Bugs</div>
                    </div>
                    <div class="md:col-span-1 ui-panel !bg-black/20">
                        <h3 class="text-xl text-slate-300 mb-2">Bugs by Status</h3>
                        <canvas id="status-chart"></canvas>
                    </div>
                    <div class="md:col-span-2 ui-panel !bg-black/20">
                        <h3 class="text-xl text-slate-300 mb-2">Bugs by Feature</h3>
                        <canvas id="feature-chart"></canvas>
                    </div>
                </div>
            </div>
            <div id="bug-form-container" class="ui-panel mb-8" style="display: none;">
                <h2 id="bug-form-toggle" class="text-white text-shadow-heavy" style="font-size: 30px; margin-bottom: 1rem;">Submit a New Bug</h2>
                <form id="bug-form" class="space-y-4">
                    <div>
                        <label for="bug-title" class="block font-medium text-slate-300 mb-1 text-shadow-heavy" style="font-size: 20px;">Bug Title</label>
                        <input type="text" id="bug-title" required class="gravitas-input" maxlength="64">
                        <div id="bug-title-counter" class="char-counter">0/64</div>
                    </div>
                    <div>
                        <label for="bug-description" class="block font-medium text-slate-300 mb-1 text-shadow-heavy" style="font-size: 20px;">Description (Markdown enabled)</label>
                        <textarea id="bug-description" rows="3" required class="gravitas-input" maxlength="16384"></textarea>
                        <div id="bug-description-counter" class="char-counter">0/16384</div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="bug-priority" class="block font-medium text-slate-300 mb-1 text-shadow-heavy" style="font-size: 20px;">Priority</label>
                            <select id="bug-priority" class="gravitas-input">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                                <option>Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label for="bug-feature" class="block font-medium text-slate-300 mb-1 text-shadow-heavy" style="font-size: 20px;">Game Feature(s)</label>
                            <div id="feature-toggles" class="ui-panel !p-2 !bg-black/20">
                                <div class="feature-toggle-group">
                                    <span class="feature-toggle-label">Core Mechanics</span>
                                    <button type="button" class="feature-toggle" data-feature="Player Movement">Player Movement</button>
                                    <button type="button" class="feature-toggle" data-feature="Player Animation">Player Animation</button>
                                    <button type="button" class="feature-toggle" data-feature="Gravity Fields">Gravity Fields</button>
                                    <button type="button" class="feature-toggle" data-feature="Block Interaction">Block Interaction</button>
                                    <button type="button" class="feature-toggle" data-feature="Crafting/Inventory">Crafting/Inventory</button>
                                </div>
                                <div class="feature-toggle-group">
                                    <span class="feature-toggle-label">World & Environment</span>
                                    <button type="button" class="feature-toggle" data-feature="World Generation">World Generation</button>
                                    <button type="button" class="feature-toggle" data-feature="Lighting & Shadows">Lighting & Shadows</button>
                                    <button type="button" class="feature-toggle" data-feature="Physics & Collisions">Physics & Collisions</button>
                                </div>
                                <div class="feature-toggle-group">
                                    <span class="feature-toggle-label">Items & Blocks</span>
                                    <button type="button" class="feature-toggle" data-feature="Block(s)">Block(s)</button>
                                    <button type="button" class="feature-toggle" data-feature="Non-cube block(s)">Non-cube block(s)</button>
                                    <button type="button" class="feature-toggle" data-feature="Tools & Equipment">Tools & Equipment</button>
                                    <button type="button" class="feature-toggle" data-feature="Logic Block(s)">Logic Block(s)</button>
                                </div>
                                <div class="feature-toggle-group">
                                    <span class="feature-toggle-label">Technical</span>
                                    <button type="button" class="feature-toggle" data-feature="Performance/Lag">Performance/Lag</button>
                                    <button type="button" class="feature-toggle" data-feature="Crashes">Crashes</button>
                                    <button type="button" class="feature-toggle" data-feature="Multiplayer/Netcode">Multiplayer/Netcode</button>
                                    <button type="button" class="feature-toggle" data-feature="UI/UX">UI/UX</button>
                                    <button type="button" class="feature-toggle" data-feature="Audio">Audio</button>
                                </div>
                                <button type="button" class="feature-toggle" data-feature="Other">Other</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block font-medium text-slate-300 mb-1 text-shadow-heavy" style="font-size: 20px;">Game Mode(s)</label>
                        <div id="game-mode-toggles" class="flex gap-2">
                            <button type="button" class="mode-toggle gravitas-input !w-auto !px-4" data-mode="Singleplayer">Singleplayer</button>
                            <button type="button" class="mode-toggle gravitas-input !w-auto !px-4" data-mode="Multiplayer">Multiplayer</button>
                        </div>
                    </div>
                    <div>
                        <label for="bug-attachment" class="block font-medium text-slate-300 mb-1 text-shadow-heavy" style="font-size: 20px;">Attach Images (Up to 5)</label>
                        <input type="file" id="bug-attachment" class="gravitas-input" accept="image/*" multiple>
                        <div id="attachment-preview-container" class="flex gap-2 flex-wrap"></div>
                    </div>
                    <button type="submit" class="gravitas-button mt-4">Add Bug</button>
                    <div id="upload-progress" class="text-center text-lg text-yellow-400 text-shadow-heavy" style="display: none;"></div>
                </form>
            </div>
            <div id="bug-list-wrapper">
                <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <div class="flex items-center gap-4">
                        <h2 class="text-white text-shadow-heavy" style="font-size: 36px;">Bugs</h2>
                        <input type="text" id="search-bar" placeholder="Search bugs..." class="gravitas-input" style="font-size: 18px; padding-top: 0.25rem; padding-bottom: 0.25rem; width: 12rem;">
                        <div id="my-bugs-btn-container"></div>
                    </div>
                    <div class="flex gap-2 sm:gap-4">
                        <div>
                            <label for="filter-status" class="sr-only">Filter by status</label>
                            <select id="filter-status" class="gravitas-input" style="font-size: 18px; padding-top: 0.25rem; padding-bottom: 0.25rem;">
                                <option value="All">All Bugs</option>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                        <div>
                            <label for="filter-feature" class="sr-only">Filter by feature</label>
                            <select id="filter-feature" class="gravitas-input" style="font-size: 18px; padding-top: 0.25rem; padding-bottom: 0.25rem;">
                                <option>All Features</option>
                                <optgroup label="Core Mechanics">
                                    <option>Player Movement</option>
                                    <option>Player Animation</option>
                                    <option>Gravity Fields</option>
                                    <option>Block Interaction</option>
                                    <option>Crafting/Inventory</option>
                                </optgroup>
                                <optgroup label="World & Environment">
                                    <option>World Generation</option>
                                    <option>Lighting & Shadows</option>
                                    <option>Physics & Collisions</option>
                                </optgroup>
                                <optgroup label="Items & Blocks">
                                    <option>Block(s)</option>
                                    <option>Non-cube block(s)</option>
                                    <option>Tools & Equipment</option>
                                    <option>Logic Block(s)</option>
                                </optgroup>
                                <optgroup label="Technical">
                                    <option>Performance/Lag</option>
                                    <option>Crashes</option>
                                    <option>Multiplayer/Netcode</option>
                                    <option>UI/UX</option>
                                    <option>Audio</option>
                                </optgroup>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label for="sort-bugs" class="sr-only">Sort bugs</label>
                            <select id="sort-bugs" class="gravitas-input" style="font-size: 18px; padding-top: 0.25rem; padding-bottom: 0.25rem;">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="votes">Most Votes</option>
                                <option value="priority_high">Priority (High-Low)</option>
                                <option value="priority_low">Priority (Low-High)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div id="bug-list" class="space-y-2">
                    <div class="ui-panel p-4 text-center text-slate-400" style="font-size: 24px;">Loading bugs...</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Suggestions Page --><div id="suggestions-page" class="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8" style="display: none;">
        <header class="text-center mb-8">
            <div class="flex justify-center items-center mb-4">
                <h1 class="font-bold text-white text-shadow-heavy" style="font-size: 52px;">
                    Game Suggestions
                </h1>
            </div>
        </header>

        <div class="space-y-8">
            <div id="suggestion-form-container" class="ui-panel" style="display: none;">
                <h2 class="text-white text-shadow-heavy" style="font-size: 30px; margin-bottom: 1rem;">Submit a New Suggestion</h2>
                <form id="suggestion-form" class="space-y-4">
                    <div>
                        <label for="suggestion-title" class="block font-medium text-slate-300 mb-1 text-shadow-heavy" style="font-size: 20px;">Suggestion Title</label>
                        <input type="text" id="suggestion-title" required class="gravitas-input" maxlength="64">
                        <div id="suggestion-title-counter" class="char-counter">0/64</div>
                    </div>
                    <div>
                        <label for="suggestion-description" class="block font-medium text-slate-300 mb-1 text-shadow-heavy" style="font-size: 20px;">Description (Markdown enabled)</label>
                        <textarea id="suggestion-description" rows="3" required class="gravitas-input" maxlength="8192"></textarea>
                        <div id="suggestion-description-counter" class="char-counter">0/8192</div>
                    </div>
                    <div>
                        <label for="suggestion-attachment" class="block font-medium text-slate-300 mb-1 text-shadow-heavy" style="font-size: 20px;">Attach Images (Up to 5)</label>
                        <input type="file" id="suggestion-attachment" class="gravitas-input" accept="image/*" multiple>
                        <div id="suggestion-attachment-preview-container" class="flex gap-2 flex-wrap"></div>
                    </div>
                    <button type="submit" class="gravitas-button mt-4">Add Suggestion</button>
                </form>
            </div>

            <div id="suggestion-list-wrapper">
                <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h2 class="text-white text-shadow-heavy" style="font-size: 36px;">Suggestions</h2>
                    <div class="flex items-center gap-4">
                        <input type="text" id="suggestion-search-bar" placeholder="Search..." class="gravitas-input" style="font-size: 18px; padding-top: 0.25rem; padding-bottom: 0.25rem; width: 12rem;">
                        <select id="suggestion-sort" class="gravitas-input" style="font-size: 18px; padding-top: 0.25rem; padding-bottom: 0.25rem;">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="votes">Most Votes</option>
                        </select>
                    </div>
                </div>
                <div id="suggestion-list" class="space-y-2">
                    <div class="ui-panel p-4 text-center text-slate-400" style="font-size: 24px;">Loading suggestions...</div>
                </div>
            </div>
        </div>
    </div>


    <!-- Bug Detail Modal --><div id="bug-detail-modal" class="fixed inset-0 bg-black/60 items-center justify-center p-4" style="display: none;">
        <div class="ui-panel w-full max-w-3xl max-h-[90vh] flex flex-col">
            <!-- Modal Header --><div class="flex justify-between items-center mb-4">
                <div id="detail-title-container" class="flex-grow mr-4 min-w-0">
                     <div id="detail-title" class="text-white text-shadow-heavy markdown-content" style="font-size: 30px;"></div>
                </div>
                <div class="flex items-center gap-4 flex-shrink-0">
                    <div id="detail-actions-container" class="flex items-center gap-2"></div>
                    <button id="close-detail-btn" class="text-gray-400 hover:text-white" style="font-size: 36px; line-height: 1;">&times;</button>
                </div>
            </div>

            <!-- Modal Body --><div class="flex-grow overflow-y-auto space-y-6 pr-2">
                <!-- Bug Info --><div id="detail-description-container" class="space-y-2 text-shadow-heavy">
                    <div id="detail-description" class="markdown-content text-slate-300" style="font-size: 20px;"></div>
                </div>
                <div id="detail-meta" class="text-slate-500" style="font-size: 16px;"></div>
                 <!-- Attachment Display --><div id="detail-attachment-container" class="mt-4"></div>
                
                <!-- Comments Section --><div>
                    <h3 class="text-white text-shadow-heavy" style="font-size: 24px; margin-bottom: 0.5rem;">Comments</h3>
                    <div id="comment-list" class="space-y-3"></div>
                </div>
            </div>
             <!-- Comment Form --><form id="comment-form" class="mt-4 pt-4 border-t-2 border-gray-700 space-y-2" style="display: none;">
                <textarea id="comment-input" class="gravitas-input !text-lg" rows="2" placeholder="Add a comment (Markdown enabled)..." maxlength="1024"></textarea>
                <div id="comment-input-counter" class="char-counter">0/1024</div>
                <input type="file" id="comment-attachment" class="gravitas-input !text-base" accept="image/*" multiple>
                <div id="comment-attachment-preview-container" class="flex gap-2 flex-wrap"></div>
                <button type="submit" class="gravitas-button !text-lg mt-2">Submit Comment</button>
            </form>
        </div>
    </div>

    <!-- Activity Timeline Button --><div id="activity-timeline-btn" style="display: none;">
        <button class="gravitas-button !w-auto !p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 icon-pixelated">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
    </div>

    <!-- Activity Timeline Modal --><div id="activity-timeline-modal" class="fixed inset-0 bg-black/80 items-center justify-center p-4" style="display: none; z-index: 1050;">
        <div class="ui-panel w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-white text-shadow-heavy" style="font-size: 30px;">Activity Timeline</h2>
                <button id="close-timeline-btn" class="text-gray-400 hover:text-white" style="font-size: 36px; line-height: 1;">&times;</button>
            </div>
            <div class="flex-grow overflow-y-auto space-y-3 pr-2" id="timeline-list">
                <!-- Timeline items will be inserted here --></div>
        </div>
    </div>

    <!-- Scroll to Top Button --><div id="scroll-to-top-btn" style="display: none;">
        <button class="gravitas-button !w-auto !p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 icon-pixelated">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
            </svg>
        </button>
    </div>


    <!-- Firebase SDK --><script type="module">
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getFirestore, collection, addDoc, onSnapshot, doc, query, updateDoc, orderBy, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
        import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        
        // Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyA8PWIxwubwv0GR1e5r78vYyAyo5ePlTgg",
          authDomain: "gravitas-bug-tracker.firebaseapp.com",
          projectId: "gravitas-bug-tracker",
          storageBucket: "gravitas-bug-tracker.firebasestorage.app",
          messagingSenderId: "425083900229",
          appId: "1:425083900229:web:131f9ca49d93292c05ae2c"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        // --- CONFIGURATION ---
        const ADMIN_EMAIL = "babababoogiewayne@gmail.com";
        const CLOUDINARY_CLOUD_NAME = "dxfkyg5kv";
        const CLOUDINARY_UPLOAD_PRESET = "gravitas_bugs";

        // DOM Elements
        const bugForm = document.getElementById('bug-form');
        const bugList = document.getElementById('bug-list');
        const bugFormContainer = document.getElementById('bug-form-container');
        const filterFeatureEl = document.getElementById('filter-feature');
        const filterStatusEl = document.getElementById('filter-status');
        const sortBugsEl = document.getElementById('sort-bugs');
        const searchBarEl = document.getElementById('search-bar');
        const myBugsBtnContainer = document.getElementById('my-bugs-btn-container');
        const uploadProgressEl = document.getElementById('upload-progress');
        const bugAttachmentInput = document.getElementById('bug-attachment');
        const attachmentPreviewContainer = document.getElementById('attachment-preview-container');
        const bugTitleInput = document.getElementById('bug-title');
        const bugDescriptionInput = document.getElementById('bug-description');
        const bugTitleCounter = document.getElementById('bug-title-counter');
        const bugDescriptionCounter = document.getElementById('bug-description-counter');
        const gameModeToggles = document.getElementById('game-mode-toggles');
        const featureToggles = document.getElementById('feature-toggles');
        const bugFormToggle = document.getElementById('bug-form-toggle');
        
        // Modal DOM Elements
        const bugDetailModal = document.getElementById('bug-detail-modal');
        const closeDetailBtn = document.getElementById('close-detail-btn');
        const detailTitle = document.getElementById('detail-title');
        const detailTitleContainer = document.getElementById('detail-title-container');
        const detailDescription = document.getElementById('detail-description');
        const detailDescriptionContainer = document.getElementById('detail-description-container');
        const detailMeta = document.getElementById('detail-meta');
        const detailActionsContainer = document.getElementById('detail-actions-container');
        const detailAttachmentContainer = document.getElementById('detail-attachment-container');
        const commentList = document.getElementById('comment-list');
        const commentForm = document.getElementById('comment-form');
        const commentInput = document.getElementById('comment-input');
        const commentAttachmentInput = document.getElementById('comment-attachment');
        const commentAttachmentPreviewContainer = document.getElementById('comment-attachment-preview-container');
        const commentInputCounter = document.getElementById('comment-input-counter');
        
        // Activity Timeline Elements
        const activityTimelineBtn = document.getElementById('activity-timeline-btn');
        const activityTimelineModal = document.getElementById('activity-timeline-modal');
        const closeTimelineBtn = document.getElementById('close-timeline-btn');
        const timelineList = document.getElementById('timeline-list');
        
        // Scroll to Top Element
        const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

        // Page Navigation Elements
        const navToggleBtn = document.getElementById('nav-toggle-btn');
        const navPanel = document.getElementById('nav-panel');
        const navAuthContainer = document.getElementById('nav-auth-container');
        const bugTrackerPage = document.getElementById('bug-tracker-page');
        const suggestionsPage = document.getElementById('suggestions-page');
        const goToTrackerBtn = document.getElementById('go-to-tracker-btn');
        const goToSuggestionsBtn = document.getElementById('go-to-suggestions-btn');

        // Suggestions Elements
        const suggestionFormContainer = document.getElementById('suggestion-form-container');
        const suggestionForm = document.getElementById('suggestion-form');
        const suggestionList = document.getElementById('suggestion-list');
        const suggestionTitleInput = document.getElementById('suggestion-title');
        const suggestionDescriptionInput = document.getElementById('suggestion-description');
        const suggestionTitleCounter = document.getElementById('suggestion-title-counter');
        const suggestionDescriptionCounter = document.getElementById('suggestion-description-counter');
        const suggestionAttachmentInput = document.getElementById('suggestion-attachment');
        const suggestionAttachmentPreviewContainer = document.getElementById('suggestion-attachment-preview-container');
        const suggestionSearchBarEl = document.getElementById('suggestion-search-bar');
        const suggestionSortEl = document.getElementById('suggestion-sort');


        let currentUser = null;
        let allBugs = []; // Master list of bugs from Firestore
        let allSuggestions = []; // Master list of suggestions from Firestore

        let editingCommentId = null;
        let activeBugId = null; 
        let unsubscribeComments = null; 
        let isMyBugsViewActive = false;
        let isModalEditing = false;
        
        let bugAttachmentFiles = [];
        let commentAttachmentFiles = [];
        let suggestionAttachmentFiles = [];

        let statusChart = null;
        let featureChart = null;
        let chartAnimationInterval = null;

        const statusStyles = {
            'Open': { bgColor: 'bg-yellow-400' },
            'In Progress': { bgColor: 'bg-blue-400' },
            'Resolved': { bgColor: 'bg-green-400' },
            'Urgent': { bgColor: 'status-urgent' }
        };

        const priorityValues = { 'Low': 0, 'Medium': 1, 'High': 2, 'Critical': 3, 'Urgent': 4 };
        
        // --- CHARACTER COUNTERS ---
        function setupCounter(inputEl, counterEl, maxLength) {
            inputEl.addEventListener('input', () => {
                counterEl.textContent = `${inputEl.value.length}/${maxLength}`;
            });
        }
        setupCounter(bugTitleInput, bugTitleCounter, 64);
        setupCounter(bugDescriptionInput, bugDescriptionCounter, 16384);
        setupCounter(commentInput, commentInputCounter, 1024);
        setupCounter(suggestionTitleInput, suggestionTitleCounter, 64);
        setupCounter(suggestionDescriptionInput, suggestionDescriptionCounter, 8192);

        bugFormToggle.addEventListener('click', () => {
            const container = document.getElementById('bug-form-container');
            const isNowCollapsed = container.classList.toggle('form-collapsed');
            if (isNowCollapsed) {
                bugFormToggle.textContent = 'Submit a New Bug +';
            } else {
                bugFormToggle.textContent = 'Submit a New Bug';
            }
        });

        gameModeToggles.addEventListener('click', (e) => {
            if (e.target.classList.contains('mode-toggle')) {
                e.target.classList.toggle('active');
            }
        });

        featureToggles.addEventListener('click', (e) => {
            if (e.target.classList.contains('feature-toggle')) {
                e.target.classList.toggle('active');
            }
        });

        // --- AUTHENTICATION ---
        onAuthStateChanged(auth, (user) => {
            currentUser = user;
            updateUIForAuthState();
            processAndRenderBugs();
            commentForm.style.display = user ? 'block' : 'none';
        });

        function updateUIForAuthState() {
            navAuthContainer.innerHTML = ''; // Clear previous buttons
            myBugsBtnContainer.innerHTML = '';

            if (currentUser) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logout-btn';
                logoutBtn.className = 'gravitas-button';
                logoutBtn.textContent = 'Logout';
                logoutBtn.style.cssText = 'width: 100%; font-size: 18px; background-color: #991b1b;';
                logoutBtn.addEventListener('click', () => signOut(auth));
                logoutBtn.onmouseover = (e) => e.target.style.backgroundColor = '#b91c1c';
                logoutBtn.onmouseout = (e) => e.target.style.backgroundColor = '#991b1b';
                navAuthContainer.appendChild(logoutBtn);

                const myBugsBtn = document.createElement('button');
                myBugsBtn.id = 'my-bugs-btn';
                myBugsBtn.className = 'gravitas-input !text-lg !py-1 !px-3';
                myBugsBtn.textContent = 'My Bugs';
                myBugsBtn.style.cssText = 'font-size: 18px; padding-top: 0.25rem; padding-bottom: 0.25rem;';
                myBugsBtn.addEventListener('click', toggleMyBugsView);
                myBugsBtnContainer.appendChild(myBugsBtn);
                
                bugFormContainer.style.display = 'block';
                // Start collapsed by default
                if (!bugFormContainer.classList.contains('form-expanded-once')) {
                    bugFormContainer.classList.add('form-collapsed');
                    bugFormToggle.textContent = 'Submit a New Bug +';
                    bugFormContainer.classList.add('form-expanded-once'); // Prevents re-collapsing on auth state changes
                }
                suggestionFormContainer.style.display = 'block';

            } else {
                const loginBtn = document.createElement('button');
                loginBtn.id = 'login-btn';
                loginBtn.className = 'gravitas-button';
                loginBtn.textContent = 'Login';
                loginBtn.style.cssText = 'width: 100%; font-size: 18px; background-color: #1e40af;';
                loginBtn.addEventListener('click', () => signInWithPopup(auth, provider));
                loginBtn.onmouseover = (e) => e.target.style.backgroundColor = '#1d4ed8';
                loginBtn.onmouseout = (e) => e.target.style.backgroundColor = '#1e40af';
                navAuthContainer.appendChild(loginBtn);
                
                isMyBugsViewActive = false;
                bugFormContainer.style.display = 'none';
                bugFormContainer.classList.remove('form-collapsed', 'form-expanded-once');
                bugFormToggle.textContent = 'Submit a New Bug';
                suggestionFormContainer.style.display = 'none';
            }
            updateMyBugsButtonState();
        }
        
        function toggleMyBugsView() {
            isMyBugsViewActive = !isMyBugsViewActive;
            updateMyBugsButtonState();
            processAndRenderBugs();
        }

        function updateMyBugsButtonState() {
            const myBugsBtn = document.getElementById('my-bugs-btn');
            if (myBugsBtn) {
                if (isMyBugsViewActive) {
                    myBugsBtn.style.backgroundColor = '#1d4ed8'; // Active color
                    myBugsBtn.style.borderColor = '#60a5fa';
                } else {
                    myBugsBtn.style.backgroundColor = '#111'; // Default color
                    myBugsBtn.style.borderColor = '#333';
                }
            }
        }

        // --- FIRESTORE DATABASE ---
        const bugsCollection = collection(db, "bugs");
        const q = query(bugsCollection);
        onSnapshot(q, (querySnapshot) => {
            allBugs = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const bug = { 
                    id: doc.id, 
                    ...data,
                    createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
                };
                allBugs.push(bug);
            });
            updateDashboard(allBugs);
            processAndRenderBugs();
        });

        const suggestionsCollection = collection(db, "suggestions");
        const qSuggestions = query(suggestionsCollection);
        onSnapshot(qSuggestions, (querySnapshot) => {
            allSuggestions = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const suggestion = {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
                };
                allSuggestions.push(suggestion);
            });
            // We will create this function in the next step
            processAndRenderSuggestions(); 
        });
        
        // --- DASHBOARD & ANALYTICS ---
        function updateDashboard(bugs) {
            const resolvedBugs = bugs.filter(b => b.status === 'Resolved').length;
            const unresolvedBugs = bugs.filter(b => b.status !== 'Resolved').length;
            const urgentBugs = bugs.filter(b => b.status === 'Urgent').length;

            document.getElementById('resolved-bugs').textContent = resolvedBugs;
            document.getElementById('open-bugs').textContent = unresolvedBugs;
            document.getElementById('urgent-bugs').textContent = urgentBugs;
            
            // Status Chart Data
            const statusCounts = bugs.reduce((acc, bug) => {
                acc[bug.status] = (acc[bug.status] || 0) + 1;
                return acc;
            }, {});

            const statusColors = {
                'Open': '#FBBF24',
                'In Progress': '#60A5FA',
                'Resolved': '#4ADE80',
                'Urgent': '#dc2626'
            };

            const statusData = {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: Object.keys(statusCounts).map(status => statusColors[status] || '#888'),
                    borderColor: '#111',
                }]
            };

            // Feature Chart Data (now handles multiple features per bug)
            const featureCounts = bugs.reduce((acc, bug) => {
                const features = bug.features || [];
                features.forEach(feature => {
                    acc[feature] = (acc[feature] || 0) + 1;
                });
                return acc;
            }, {});

            const featureData = {
                labels: Object.keys(featureCounts),
                datasets: [{
                    label: '# of Bugs',
                    data: Object.values(featureCounts),
                    backgroundColor: '#444',
                    borderColor: '#888',
                    borderWidth: 1
                }]
            };

            // Update or create charts
            const statusCtx = document.getElementById('status-chart').getContext('2d');
            if(statusChart) statusChart.destroy();
            statusChart = new Chart(statusCtx, {
                type: 'pie',
                data: statusData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

            if (chartAnimationInterval) clearInterval(chartAnimationInterval);
            const urgentIndex = statusData.labels.indexOf('Urgent');

            if (urgentIndex !== -1) {
                chartAnimationInterval = setInterval(() => {
                    if (!statusChart) return;
                    const time = new Date().getTime() / 400; 
                    const alpha = (Math.sin(time) + 1) / 2;

                    const r = Math.round(220 + (252 - 220) * alpha);
                    const g = Math.round(38 + (114 - 38) * alpha);
                    const b = Math.round(38 + (114 - 38) * alpha);
                    const pulsatingColor = `rgb(${r},${g},${b})`;
                    
                    if (statusChart.data.datasets[0].backgroundColor) {
                        statusChart.data.datasets[0].backgroundColor[urgentIndex] = pulsatingColor;
                        statusChart.update('none');
                    }
                }, 1000 / 30);
            }


            const featureCtx = document.getElementById('feature-chart').getContext('2d');
            if(featureChart) featureChart.destroy();
            featureChart = new Chart(featureCtx, {
                type: 'bar',
                data: featureData,
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    scales: {
                        x: {
                            ticks: { color: '#999', font: { family: "'VT323', monospace", size: 14 } },
                            grid: { color: '#333' }
                        },
                        y: {
                            ticks: { color: '#999', font: { family: "'VT323', monospace", size: 14 } },
                            grid: { color: '#333' }
                        }
                    },
                    plugins: {
                        legend: {
                           display: false
                        }
                    }
                }
            });
        }
        
        // --- UI LOGIC ---
        filterFeatureEl.addEventListener('change', processAndRenderBugs);
        filterStatusEl.addEventListener('change', processAndRenderBugs);
        sortBugsEl.addEventListener('change', processAndRenderBugs);
        searchBarEl.addEventListener('input', processAndRenderBugs);
        
        function processAndRenderBugs() {
            let processedBugs = [...allBugs];

            if (isMyBugsViewActive && currentUser) {
                processedBugs = processedBugs.filter(bug => 
                    bug.reporter === currentUser.email || 
                    (bug.watchers && bug.watchers.includes(currentUser.email))
                );
            }

            const searchTerm = searchBarEl.value.toLowerCase().trim();
            if (searchTerm) {
                processedBugs = processedBugs.filter(bug =>
                    bug.title.toLowerCase().includes(searchTerm) ||
                    bug.description.toLowerCase().includes(searchTerm)
                );
            }
            const statusFilter = filterStatusEl.value;
            if (statusFilter !== 'All') {
                processedBugs = processedBugs.filter(bug => bug.status === statusFilter);
            }
            const featureFilter = filterFeatureEl.value;
            if (featureFilter !== 'All Features') {
                processedBugs = processedBugs.filter(bug => (bug.features || []).includes(featureFilter));
            }
            const sortValue = sortBugsEl.value;
            processedBugs.sort((a, b) => {
                switch (sortValue) {
                    case 'newest': return b.createdAt - a.createdAt;
                    case 'oldest': return a.createdAt - b.createdAt;
                    case 'votes': return (b.votes || 0) - (a.votes || 0);
                    case 'priority_high': return priorityValues[b.priority] - priorityValues[a.priority];
                    case 'priority_low': return priorityValues[a.priority] - priorityValues[b.priority];
                    default: return 0;
                }
            });
            renderBugs(processedBugs);
        }
        
        function renderBugs(bugs) {
            bugList.innerHTML = ''; 
            if (bugs.length === 0) {
                bugList.innerHTML = `<div class="ui-panel p-4 text-center text-slate-400" style="font-size: 24px;">No bugs match your filters.</div>`;
                return;
            }

            bugs.forEach(bug => {
                const bugElement = document.createElement('div');
                const isWatching = currentUser && bug.watchers?.includes(currentUser.email);
                bugElement.className = `ui-panel flex gap-4 items-start hover:border-gray-400 ${isWatching ? 'watching-bug' : ''}`;
                bugElement.setAttribute('data-bug-id', bug.id);

                const isUserAdmin = currentUser && currentUser.email === ADMIN_EMAIL;
                const formattedDate = bug.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                const reporterName = bug.reporter ? bug.reporter.split('@')[0] : 'Anonymous';
                const reporterInfoHTML = isUserAdmin ? `Reported by ${reporterName} on ${formattedDate}` : `Reported on ${formattedDate}`;
                
                const voteCount = bug.votes || 0;
                const hasVoted = currentUser && bug.voters?.includes(currentUser.email);

                const voteButtonHTML = currentUser ? `
                    <button class="vote-button ${hasVoted ? 'voted' : ''}" data-bug-id="${bug.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 icon-pixelated">
                            <path d="M10 4l-6 6h4v6h4v-6h4l-6-6z" />
                        </svg>
                    </button>
                ` : '';

                const statusDisplay = bug.resolution ? `${bug.status} - ${bug.resolution}` : bug.status;
                const gameModesHTML = (bug.gameModes || []).map(mode => `<span class="text-shadow-heavy bg-black/50 px-2" style="font-size: 18px;">${mode}</span>`).join(' ');
                
                const features = bug.features || [];
                const featuresHTML = features.map(feature => `<span class="text-shadow-heavy bg-black/50 px-2" style="font-size: 18px;">${feature}</span>`).join(' ');

                const resolutionSelectHTML = bug.status === 'Resolved' && isUserAdmin ? `
                    <select data-id="${bug.id}" class="resolution-select gravitas-input mt-1" style="font-size: 16px; padding-top: 0; padding-bottom: 0; width: 8rem;">
                        <option ${!bug.resolution ? 'selected' : ''} disabled>Set Resolution</option>
                        <option ${bug.resolution === 'Fixed' ? 'selected' : ''}>Fixed</option>
                        <option ${bug.resolution === 'Won\'t Fix' ? 'selected' : ''}>Won't Fix</option>
                        <option ${bug.resolution === 'Duplicate' ? 'selected' : ''}>Duplicate</option>
                        <option ${bug.resolution === 'Invalid' ? 'selected' : ''}>Invalid</option>
                        <option ${bug.resolution === 'Works as Intended' ? 'selected' : ''}>Works as Intended</option>
                    </select>
                ` : '';
                
                const lockIconSVG = bug.isLocked
                    ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-400 icon-pixelated"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-400 icon-pixelated"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>`;
                const adminLockHTML = isUserAdmin ? `<button class="lock-bug-btn icon-button">${lockIconSVG}</button>` : (bug.isLocked ? lockIconSVG : '');


                bugElement.innerHTML = `
                    <div class="flex-grow min-w-0">
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                            <div class="font-bold text-white text-shadow-heavy truncate-1-line markdown-content" style="font-size: 24px;">${marked.parse(bug.title || '')}</div>
                            ${featuresHTML}
                            ${gameModesHTML}
                            <span class="text-shadow-heavy bg-black/50 px-2" style="font-size: 18px;">${statusDisplay}</span>
                        </div>
                        <div class="text-slate-300 mb-3 text-shadow-heavy truncate-3-lines markdown-content" style="font-size: 20px;">${marked.parse(bug.description || '')}</div>
                        <div class="text-slate-500 text-shadow-heavy" style="font-size: 16px;">${reporterInfoHTML}</div>
                    </div>
                    <div class="flex flex-col items-center gap-2 text-center flex-shrink-0 pt-2">
                        <div class="w-5 h-5 ${statusStyles[bug.status]?.bgColor}"></div>
                        <div class="flex items-center gap-1">
                            ${voteButtonHTML}
                            <div class="vote-count text-white">${voteCount}</div>
                        </div>
                        <div class="text-slate-400" style="font-size:14px; margin-top: -0.25rem;">Votes</div>
                        <div class="admin-controls mt-1" data-bug-id="${bug.id}">
                             <div class="flex items-center justify-center gap-2">
                                ${adminLockHTML}
                                <div class="flex flex-col gap-1">
                                    ${isUserAdmin ? `<select class="status-select gravitas-input" style="font-size: 16px; padding-top: 0; padding-bottom: 0; width: 8rem;"><option ${bug.status === 'Open' ? 'selected' : ''}>Open</option><option ${bug.status === 'In Progress' ? 'selected' : ''}>In Progress</option><option ${bug.status === 'Urgent' ? 'selected' : ''}>Urgent</option><option ${bug.status === 'Resolved' ? 'selected' : ''}>Resolved</option></select>` : ''}
                                    ${resolutionSelectHTML}
                                </div>
                            </div>
                        </div>
                    </div>`;
                bugList.appendChild(bugElement);
            });
        }

        // --- SUGGESTION RENDERING ---
        suggestionSearchBarEl.addEventListener('input', processAndRenderSuggestions);
        suggestionSortEl.addEventListener('change', processAndRenderSuggestions);

        function processAndRenderSuggestions() {
            let processedSuggestions = [...allSuggestions];

            const searchTerm = suggestionSearchBarEl.value.toLowerCase().trim();
            if (searchTerm) {
                processedSuggestions = processedSuggestions.filter(s =>
                    s.title.toLowerCase().includes(searchTerm) ||
                    s.description.toLowerCase().includes(searchTerm)
                );
            }

            const sortValue = suggestionSortEl.value;
            processedSuggestions.sort((a, b) => {
                switch (sortValue) {
                    case 'newest': return b.createdAt - a.createdAt;
                    case 'oldest': return a.createdAt - b.createdAt;
                    case 'votes': return (b.votes || 0) - (a.votes || 0);
                    default: return 0;
                }
            });

            renderSuggestions(processedSuggestions);
        }

        function renderSuggestions(suggestions) {
            suggestionList.innerHTML = '';
            if (suggestions.length === 0) {
                suggestionList.innerHTML = `<div class="ui-panel p-4 text-center text-slate-400" style="font-size: 24px;">No suggestions yet. Be the first!</div>`;
                return;
            }

            suggestions.forEach(suggestion => {
                const suggestionElement = document.createElement('div');
                suggestionElement.className = 'ui-panel flex gap-4 items-start';
                suggestionElement.setAttribute('data-suggestion-id', suggestion.id);

                const isUserAdmin = currentUser && currentUser.email === ADMIN_EMAIL;
                const formattedDate = suggestion.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const reporterName = suggestion.reporter ? suggestion.reporter.split('@')[0] : 'A player';
                const reporterInfoHTML = isUserAdmin ? `Suggested by ${reporterName} on ${formattedDate}` : `Suggested on ${formattedDate}`;
                
                const voteCount = suggestion.votes || 0;
                const hasVoted = currentUser && suggestion.voters?.includes(currentUser.email);

                const voteButtonHTML = currentUser ? `
                    <button class="suggestion-vote-button vote-button ${hasVoted ? 'voted' : ''}" data-suggestion-id="${suggestion.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 icon-pixelated"><path d="M10 4l-6 6h4v6h4v-6h4l-6-6z" /></svg>
                    </button>
                ` : '';

                suggestionElement.innerHTML = `
                    <div class="flex-grow min-w-0">
                        <div class="font-bold text-white text-shadow-heavy markdown-content" style="font-size: 24px;">${marked.parse(suggestion.title || '')}</div>
                        <div class="text-slate-300 my-2 text-shadow-heavy markdown-content" style="font-size: 20px;">${marked.parse(suggestion.description || '')}</div>
                        <div class="text-slate-500 text-shadow-heavy" style="font-size: 16px;">${reporterInfoHTML}</div>
                    </div>
                    <div class="flex flex-col items-center gap-2 text-center flex-shrink-0 pt-2">
                        <div class="flex items-center gap-1">
                            ${voteButtonHTML}
                            <div class="vote-count text-white">${voteCount}</div>
                        </div>
                        <div class="text-slate-400" style="font-size:14px; margin-top: -0.25rem;">Votes</div>
                    </div>
                `;
                suggestionList.appendChild(suggestionElement);
            });
        }


        // --- MODAL LOGIC ---
        function openDetailView(bugId) {
            const bug = allBugs.find(b => b.id === bugId);
            if (!bug) return;

            activeBugId = bugId;
            isModalEditing = false;
            renderDetailViewContent(bug);

            bugDetailModal.style.display = 'flex';
            activityTimelineBtn.style.display = 'block';
            
            // Unsubscribe from previous listener if it exists
            if(unsubscribeComments) unsubscribeComments();

            const commentsRef = collection(db, 'bugs', bugId, 'comments');
            const qComments = query(commentsRef, orderBy('createdAt', 'asc'));

            unsubscribeComments = onSnapshot(qComments, (snapshot) => {
                commentList.innerHTML = '';
                 if (snapshot.empty) {
                    commentList.innerHTML = '<p class="text-slate-500 text-lg text-shadow-heavy">No comments yet.</p>';
                }
                snapshot.forEach(doc => {
                    const comment = {id: doc.id, ...doc.data()};
                    const commentEl = renderComment(comment);
                    commentList.appendChild(commentEl);
                });
            });
        }

        function renderDetailViewContent(bug) {
            const isUserAdmin = currentUser && currentUser.email === ADMIN_EMAIL;
            const canUserEdit = currentUser && (currentUser.email === bug.reporter || isUserAdmin);
            const isBugLockedForUser = bug.isLocked && !isUserAdmin;
            
            // Render view or edit mode
            if (isModalEditing) {
                detailTitleContainer.innerHTML = `<input type="text" id="edit-detail-title" class="gravitas-input !text-2xl" value="${bug.title}" maxlength="64">`;
                detailDescriptionContainer.innerHTML = `<textarea id="edit-detail-description" class="gravitas-input !text-xl" rows="4" maxlength="16384">${bug.description}</textarea>`;
                detailActionsContainer.innerHTML = `
                    <button id="save-detail-btn" class="gravitas-button !text-base !py-1">Save</button>
                    <button id="cancel-detail-btn" class="gravitas-button !text-base !py-1 !bg-gray-600">Cancel</button>
                `;
            } else {
                const voteCount = bug.votes || 0;
                const hasVoted = currentUser && bug.voters?.includes(currentUser.email);
                const voteInfoHTML = `
                    <div class="flex items-center gap-2 flex-shrink-0">
                        ${currentUser ? `<button class="vote-button ${hasVoted ? 'voted' : ''}" data-bug-id="${bug.id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 icon-pixelated"><path d="M10 4l-6 6h4v6h4v-6h4l-6-6z" /></svg></button>` : ''}
                        <div class="vote-count text-white">${voteCount}</div>
                        <div class="text-slate-500" style="font-size:14px;">VOTES</div>
                    </div>`;

                const isWatching = currentUser && bug.watchers?.includes(currentUser.email);
                const watchButtonHTML = currentUser ? `<button id="watch-btn" class="gravitas-button !text-base !py-1 ${isWatching ? 'watching' : ''}">${isWatching ? 'Watching' : 'Watch'}</button>` : '';

                detailTitleContainer.innerHTML = `<div id="detail-title" class="text-white text-shadow-heavy markdown-content" style="font-size: 30px;">${marked.parse(bug.title || '')}</div>`;

                detailDescriptionContainer.innerHTML = `<div id="detail-description" class="markdown-content text-slate-300" style="font-size: 20px;">${marked.parse(bug.description || '')}</div>`;
                
                const lockIconSVG = bug.isLocked 
                    ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-400 icon-pixelated"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>`
                    : ``; // No icon if not locked in modal
                const lockDisplayHTML = bug.isLocked ? `<div class="icon-button">${lockIconSVG}</div>` : '';

                const editButtonHTML = canUserEdit && !isBugLockedForUser ? `<button id="edit-detail-btn" class="icon-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-gray-400 hover:text-white icon-pixelated"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg></button>` : '';
                const deleteButtonHTML = isUserAdmin ? `<button id="delete-detail-btn" class="icon-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-red-500 hover:text-red-400 icon-pixelated"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.023 2.5.067V3.75a1.25 1.25 0 00-1.25-1.25h-2.5A1.25 1.25 0 007.5 3.75v.317c.827-.044 1.66-.067 2.5-.067zM8.25 6.75a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5a.75.75 0 01.75-.75zm3.5 0a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5a.75.75 0 01.75-.75z" clip-rule="evenodd" /></svg></button>` : '';
                detailActionsContainer.innerHTML = `${watchButtonHTML} ${voteInfoHTML} ${lockDisplayHTML} ${editButtonHTML} ${deleteButtonHTML}`;
            }

            const statusDisplay = bug.resolution ? `${bug.status} - ${bug.resolution}` : bug.status;
            const formattedDate = bug.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const reporterName = bug.reporter ? bug.reporter.split('@')[0] : 'Anonymous';
            const reporterInfoHTML = isUserAdmin ? `Reported by ${reporterName} on ${formattedDate}` : `Reported on ${formattedDate}`;
            const gameModesText = (bug.gameModes && bug.gameModes.length > 0) ? ` | <span class="text-shadow-heavy bg-black/50 px-2" style="font-size: 18px;">${bug.gameModes.join(', ')}</span>` : '';
            
            const features = bug.features || [];
            const featuresText = ` | <span class="text-shadow-heavy bg-black/50 px-2" style="font-size: 18px;">${features.join(', ')}</span>`;

            detailMeta.innerHTML = `<span class="text-shadow-heavy bg-black/50 px-2" style="font-size: 18px;">${statusDisplay}</span>${featuresText}${gameModesText} | <span class="text-shadow-heavy bg-black/50 px-2" style="font-size: 18px;">Priority: ${bug.priority}</span><br><span>${reporterInfoHTML}</span>`;
            
            detailAttachmentContainer.innerHTML = '';
            if (bug.attachments && bug.attachments.length > 0) {
                let imagesHTML = bug.attachments.map(att => `
                    <div class="inline-block text-center mb-2">
                        <img src="${att.url}" class="max-w-full rounded-md border-2 border-gray-600" style="image-rendering: pixelated;" />
                        <p class="text-sm text-gray-400 text-shadow-heavy">${att.description || ''}</p>
                    </div>`).join('');
                detailAttachmentContainer.innerHTML = `<h3 class="text-white text-shadow-heavy" style="font-size: 24px; margin-bottom: 0.5rem;">Attachments</h3><div class="flex flex-wrap gap-4">${imagesHTML}</div>`;
            }
        }
        
        function renderComment(comment) {
            const commentEl = document.createElement('div');
            commentEl.className = 'activity-item ui-panel !p-3 !border-gray-600';
            const commentDate = comment.createdAt?.toDate().toLocaleString() || '...';
            
            const isUserAdmin = currentUser && currentUser.email === ADMIN_EMAIL;
            let authorDisplay;
            if (comment.author === ADMIN_EMAIL) {
                authorDisplay = 'An admin';
            } else if (isUserAdmin) {
                authorDisplay = comment.author ? comment.author.split('@')[0] : 'A player';
            } else {
                authorDisplay = 'A player';
            }

            let attachmentsHTML = '';
            if (comment.attachments && comment.attachments.length > 0) {
                attachmentsHTML = `<div class="flex flex-wrap gap-2 mt-2">${comment.attachments.map(att => `
                    <div class="text-center">
                         <img src="${att.url}" class="max-w-[150px] border-2 border-gray-600" style="image-rendering: pixelated;" />
                         <p class="text-xs text-gray-400 text-shadow-heavy">${att.description || ''}</p>
                    </div>`).join('')}</div>`;
            }
            commentEl.innerHTML = `
                <div class="markdown-content text-lg text-slate-300 text-shadow-heavy">${marked.parse(comment.text || '')}</div>
                ${attachmentsHTML}
                <p class="text-sm text-slate-500 text-shadow-heavy mt-1">${authorDisplay} - ${commentDate}</p>
            `;
            return commentEl;
        }


        function closeDetailView() {
            if (unsubscribeComments) unsubscribeComments();
            unsubscribeComments = null;
            bugDetailModal.style.display = 'none';
            activityTimelineBtn.style.display = 'none';
            activityTimelineModal.style.display = 'none';
            activeBugId = null;
            editingCommentId = null;
            isModalEditing = false;
            commentList.innerHTML = '';
        }

        closeDetailBtn.addEventListener('click', closeDetailView);
        
        // Close modal if user clicks on the background overlay
        bugDetailModal.addEventListener('click', (e) => {
            if (e.target === bugDetailModal) {
                closeDetailView();
            }
        });
        
        function setupAttachmentHandler(inputEl, containerEl, fileStore) {
            inputEl.addEventListener('change', (e) => updatePreview(e.target.files, containerEl, fileStore, inputEl));
            containerEl.addEventListener('click', e => handleRemovePreview(e, containerEl, fileStore, inputEl));
            containerEl.addEventListener('input', e => handleDescriptionInput(e, fileStore));
        }

        function updatePreview(files, container, fileStore, inputEl) {
            container.innerHTML = '';
            fileStore.length = 0;
            const fileList = Array.from(files).slice(0, 5); // Limit to 5 files

            fileList.forEach((file, index) => {
                fileStore.push({file, description: ''});
                const reader = new FileReader();
                reader.onload = (e) => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'attachment-preview-wrapper';
                    wrapper.innerHTML = `
                        <img src="${e.target.result}" class="attachment-preview">
                        <button type="button" data-index="${index}" class="remove-preview-btn">×</button>
                        <input type="text" data-index="${index}" class="gravitas-input !text-sm attachment-desc-input" placeholder="Description..." maxlength="128">
                    `;
                    container.appendChild(wrapper);
                }
                reader.readAsDataURL(file);
            });
             // We need to update the input's files property if we changed the file list (e.g., by slicing)
            const dt = new DataTransfer();
            fileStore.forEach(f => dt.items.add(f.file));
            inputEl.files = dt.files;
        }
        
        function handleRemovePreview(e, container, fileStore, inputEl) {
             if(e.target.classList.contains('remove-preview-btn')) {
                const index = parseInt(e.target.dataset.index);
                fileStore.splice(index, 1);
                // Re-run updatePreview to re-render the list and update the input's files
                updatePreview(fileStore.map(f => f.file), container, fileStore, inputEl);
            }
        }

        function handleDescriptionInput(e, fileStore) {
            if(e.target.classList.contains('attachment-desc-input')) {
                const index = parseInt(e.target.dataset.index);
                if(fileStore[index]) {
                    fileStore[index].description = e.target.value;
                }
            }
        }
        
        setupAttachmentHandler(bugAttachmentInput, attachmentPreviewContainer, bugAttachmentFiles);
        setupAttachmentHandler(commentAttachmentInput, commentAttachmentPreviewContainer, commentAttachmentFiles);
        setupAttachmentHandler(suggestionAttachmentInput, suggestionAttachmentPreviewContainer, suggestionAttachmentFiles);

        async function uploadToCloudinary(file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            
            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.secure_url) {
                     const parts = data.secure_url.split('/upload/');
                    return `${parts[0]}/upload/q_auto,f_auto/${parts[1]}`;
                }
                throw new Error('Cloudinary upload failed');
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Error: File upload failed.");
                return null;
            }
        }

        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser || !activeBugId) return;

            const commentText = commentInput.value.trim();
            if (!commentText && commentAttachmentFiles.length === 0) return;

            const submitButton = e.target.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            const attachments = await Promise.all(
                commentAttachmentFiles.map(async (fileData) => {
                    const url = await uploadToCloudinary(fileData.file);
                    return { url, description: fileData.description };
                })
            );

            if (attachments.some(att => !att.url)) {
                submitButton.disabled = false;
                return;
            }

            const commentsRef = collection(db, 'bugs', activeBugId, 'comments');
            await addDoc(commentsRef, {
                text: commentText,
                author: currentUser.email,
                createdAt: new Date(),
                attachments: attachments
            });
            
            commentForm.reset();
            updatePreview([], commentAttachmentPreviewContainer, commentAttachmentFiles, commentAttachmentInput);
            submitButton.disabled = false;
        });
        
        detailActionsContainer.addEventListener('click', async e => {
            if (e.target.closest('#edit-detail-btn')) {
                isModalEditing = true;
                const bug = allBugs.find(b => b.id === activeBugId);
                renderDetailViewContent(bug);
            }
            if (e.target.closest('#cancel-detail-btn')) {
                isModalEditing = false;
                const bug = allBugs.find(b => b.id === activeBugId);
                renderDetailViewContent(bug);
            }
            if (e.target.closest('#save-detail-btn')) {
                const newTitle = document.getElementById('edit-detail-title').value;
                const newDescription = document.getElementById('edit-detail-description').value;
                try {
                    await updateDoc(doc(db, "bugs", activeBugId), { title: newTitle, description: newDescription });
                    isModalEditing = false;
                    const bug = allBugs.find(b => b.id === activeBugId);
                    renderDetailViewContent(bug);
                } catch (error) { console.error("PERM ERROR: saving bug", error); }
            }
            
            if (e.target.closest('#watch-btn')) {
                handleWatch(activeBugId);
            }
            if (e.target.closest('#delete-detail-btn')) {
                const deleteBtn = e.target.closest('#delete-detail-btn');
                if (deleteBtn.dataset.confirm === 'true') {
                    try {
                        await deleteDoc(doc(db, "bugs", activeBugId));
                        closeDetailView();
                    } catch (error) { console.error("PERM ERROR: deleting bug", error); }
                } else {
                    const originalContent = deleteBtn.innerHTML;
                    deleteBtn.innerHTML = 'Confirm?';
                    deleteBtn.dataset.confirm = 'true';
                    deleteBtn.classList.add('!bg-red-800', 'text-white', 'p-1', 'rounded', 'w-24');
                    
                    setTimeout(() => {
                        if (deleteBtn.dataset.confirm === 'true') { // Check if it wasn't already clicked
                            deleteBtn.innerHTML = originalContent;
                            deleteBtn.dataset.confirm = 'false';
                            deleteBtn.classList.remove('!bg-red-800', 'text-white', 'p-1', 'rounded', 'w-24');
                        }
                    }, 3000);
                }
            }
        });

        async function logActivity(bugId, user, text) {
            if (!bugId) return;
            const activityRef = collection(db, 'bugs', bugId, 'activity');
            await addDoc(activityRef, {
                user: user,
                text: text,
                createdAt: new Date()
            });
        }

        async function handleWatch(bugId) {
            if (!currentUser) return;

            const bugRef = doc(db, "bugs", bugId);
            const bug = allBugs.find(b => b.id === bugId);
            if (!bug) return;

            const watchers = bug.watchers || [];
            const isWatching = watchers.includes(currentUser.email);

            let updatedWatchers;
            if (isWatching) {
                updatedWatchers = watchers.filter(email => email !== currentUser.email);
                 logActivity(bugId, currentUser.email, `stopped watching this issue.`);
            } else {
                updatedWatchers = [...watchers, currentUser.email];
                 logActivity(bugId, currentUser.email, `started watching this issue.`);
            }

            try {
                await updateDoc(bugRef, { watchers: updatedWatchers });
                const updatedBug = { ...bug, watchers: updatedWatchers };
                renderDetailViewContent(updatedBug);
            } catch (error) {
                console.error("Error updating watchers:", error);
            }
        }

        async function handleVote(bugId) {
            if (!currentUser) return;

            const bugRef = doc(db, "bugs", bugId);
            const bug = allBugs.find(b => b.id === bugId);
            if (!bug) return;

            const voters = bug.voters || [];
            const hasVoted = voters.includes(currentUser.email);

            let updatedVoters;
            if (hasVoted) {
                updatedVoters = voters.filter(email => email !== currentUser.email);
            } else {
                updatedVoters = [...voters, currentUser.email];
            }
            
            const updatedVotes = updatedVoters.length;

            try {
                await updateDoc(bugRef, {
                    voters: updatedVoters,
                    votes: updatedVotes
                });
            } catch (error) {
                console.error("Error updating votes:", error);
            }
        }

        async function handleSuggestionVote(suggestionId) {
             if (!currentUser) return;

            const suggestionRef = doc(db, "suggestions", suggestionId);
            const suggestion = allSuggestions.find(s => s.id === suggestionId);
            if (!suggestion) return;

            const voters = suggestion.voters || [];
            const hasVoted = voters.includes(currentUser.email);

            let updatedVoters;
            if (hasVoted) {
                updatedVoters = voters.filter(email => email !== currentUser.email);
            } else {
                updatedVoters = [...voters, currentUser.email];
            }
            
            const updatedVotes = updatedVoters.length;

            try {
                await updateDoc(suggestionRef, {
                    voters: updatedVoters,
                    votes: updatedVotes
                });
            } catch (error) {
                console.error("Error updating suggestion votes:", error);
            }
        }
        
        bugList.addEventListener('change', async (e) => {
            const adminControls = e.target.closest('.admin-controls');
            if (!adminControls) return;
            
            const bugId = adminControls.dataset.bugId;
            const isUserAdmin = currentUser && currentUser.email === ADMIN_EMAIL;
            if (!isUserAdmin) return;
            
            const bug = allBugs.find(b => b.id === bugId);
            if(!bug) return;
            
            if (e.target.classList.contains('status-select')) {
                const newStatus = e.target.value;
                const oldStatus = bug.status;
                const updateData = { status: newStatus };
                if (newStatus !== 'Resolved') {
                    updateData.resolution = null;
                }
                try {
                    await updateDoc(doc(db, "bugs", bugId), updateData);
                    logActivity(bugId, ADMIN_EMAIL, `changed status from <strong>${oldStatus}</strong> to <strong>${newStatus}</strong>.`);
                } catch (error) { console.error("PERM ERROR: updating status", error); }
            }
            
            if (e.target.classList.contains('resolution-select')) {
                const newResolution = e.target.value;
                 try {
                    await updateDoc(doc(db, "bugs", bugId), { resolution: newResolution });
                    logActivity(bugId, ADMIN_EMAIL, `set resolution to <strong>${newResolution}</strong>.`);
                } catch (error) { console.error("PERM ERROR: updating resolution", error); }
            }
        });

        bugList.addEventListener('click', async (e) => {
            const bugElement = e.target.closest('[data-bug-id]');
            if (!bugElement) return;

            const voteButton = e.target.closest('.vote-button');
            const lockButton = e.target.closest('.lock-bug-btn');
            const isInteractive = e.target.closest('select');

            if (voteButton) {
                handleVote(bugElement.dataset.bugId);
            } else if (lockButton) {
                const bug = allBugs.find(b => b.id === bugElement.dataset.bugId);
                if (!bug) return;
                const isUserAdmin = currentUser && currentUser.email === ADMIN_EMAIL;
                if (!isUserAdmin) return;
                try {
                    await updateDoc(doc(db, "bugs", bug.id), { isLocked: !bug.isLocked });
                    logActivity(bug.id, ADMIN_EMAIL, bug.isLocked ? 'unlocked this issue.' : 'locked this issue.');
                } catch (error) { console.error("PERM ERROR: locking bug", error); }
            } else if (!isInteractive) {
                openDetailView(bugElement.dataset.bugId);
            }
        });

        bugDetailModal.addEventListener('click', async (e) => {
            const voteButton = e.target.closest('.vote-button');
            if (voteButton) {
                handleVote(voteButton.dataset.bugId);
            }
        });
        
        suggestionList.addEventListener('click', (e) => {
            const voteButton = e.target.closest('.suggestion-vote-button');
            if (voteButton) {
                handleSuggestionVote(voteButton.dataset.suggestionId);
            }
        });

        bugForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) return;

            const submitButton = e.target.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            uploadProgressEl.style.display = 'block';
            
            const attachments = await Promise.all(
                bugAttachmentFiles.map(async (fileData) => {
                    uploadProgressEl.textContent = `Uploading ${fileData.file.name}...`;
                    const url = await uploadToCloudinary(fileData.file);
                    return { url, description: fileData.description };
                })
            );

            if (attachments.some(att => !att.url)) {
                submitButton.disabled = false;
                uploadProgressEl.style.display = 'none';
                return;
            }
            
            await createBugDocument(attachments);
            submitButton.disabled = false;
            uploadProgressEl.style.display = 'none';
        });

        async function createBugDocument(attachments) {
            const selectedModes = [];
            document.querySelectorAll('#game-mode-toggles .mode-toggle.active').forEach(toggle => {
                selectedModes.push(toggle.dataset.mode);
            });

            const selectedFeatures = [];
            document.querySelectorAll('#feature-toggles .feature-toggle.active').forEach(toggle => {
                selectedFeatures.push(toggle.dataset.feature);
            });

            const priority = document.getElementById('bug-priority').value;

            const newBug = {
                title: document.getElementById('bug-title').value,
                description: document.getElementById('bug-description').value,
                priority: priority,
                features: selectedFeatures,
                status: priority === 'Urgent' ? 'Urgent' : 'Open',
                createdAt: new Date(),
                reporter: currentUser.email,
                isLocked: false,
                attachments: attachments,
                votes: 0,
                voters: [],
                watchers: [currentUser.email], // Automatically watch your own bug
                resolution: null,
                gameModes: selectedModes
            };

            try {
                const docRef = await addDoc(bugsCollection, newBug);
                bugForm.reset();
                document.querySelectorAll('#game-mode-toggles .mode-toggle.active').forEach(toggle => {
                    toggle.classList.remove('active');
                });
                document.querySelectorAll('#feature-toggles .feature-toggle.active').forEach(toggle => {
                    toggle.classList.remove('active');
                });
                updatePreview([], attachmentPreviewContainer, bugAttachmentInput);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
        
        suggestionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) return;

            const submitButton = e.target.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            const attachments = await Promise.all(
                suggestionAttachmentFiles.map(async (fileData) => {
                    const url = await uploadToCloudinary(fileData.file);
                    return { url, description: fileData.description };
                })
            );

            if (attachments.some(att => !att.url)) {
                submitButton.disabled = false;
                return;
            }

            const newSuggestion = {
                title: suggestionTitleInput.value,
                description: suggestionDescriptionInput.value,
                reporter: currentUser.email,
                createdAt: new Date(),
                attachments: attachments,
                votes: 0,
                voters: [],
            };

            try {
                await addDoc(suggestionsCollection, newSuggestion);
                suggestionForm.reset();
                updatePreview([], suggestionAttachmentPreviewContainer, suggestionAttachmentFiles, suggestionAttachmentInput);
            } catch (error) {
                console.error("Error adding suggestion: ", error);
            } finally {
                submitButton.disabled = false;
            }
        });

        activityTimelineBtn.addEventListener('click', async () => {
            if (!activeBugId) return;
            activityTimelineModal.style.display = 'flex';
            timelineList.innerHTML = '<p class="text-slate-500 text-lg text-shadow-heavy">Loading activity...</p>';
            
            const bug = allBugs.find(b => b.id === activeBugId);
            const isUserAdmin = currentUser && currentUser.email === ADMIN_EMAIL;

            const commentsRef = collection(db, 'bugs', activeBugId, 'comments');
            const activityRef = collection(db, 'bugs', activeBugId, 'activity');

            const commentsQuery = query(commentsRef, orderBy('createdAt', 'asc'));
            const activityQuery = query(activityRef, orderBy('createdAt', 'asc'));

            const [commentsSnapshot, activitySnapshot] = await Promise.all([
                getDocs(commentsQuery),
                getDocs(activityQuery)
            ]);

            let combinedActivity = [];
            commentsSnapshot.forEach(doc => combinedActivity.push({ id: doc.id, type: 'comment', ...doc.data() }));
            activitySnapshot.forEach(doc => combinedActivity.push({ id: doc.id, type: 'activity', ...doc.data() }));
            
            combinedActivity.push({ 
                type: 'activity', 
                createdAt: bug.createdAt, 
                user: bug.reporter, 
                text: `reported this issue.` 
            });

            combinedActivity.sort((a, b) => {
                const dateA = a.createdAt.toDate ? a.createdAt.toDate() : a.createdAt;
                const dateB = b.createdAt.toDate ? b.createdAt.toDate() : b.createdAt;
                return dateA - dateB;
            });
            
            timelineList.innerHTML = '';
            combinedActivity.forEach(item => {
                const itemEl = document.createElement('div');
                const itemDate = (item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt).toLocaleString() || '...';
                
                if (item.type === 'comment') {
                    itemEl.className = 'activity-item ui-panel !p-3 !border-gray-600';
                    let authorDisplay;
                    if (item.author === ADMIN_EMAIL) {
                        authorDisplay = 'An admin';
                    } else if (isUserAdmin) {
                        authorDisplay = item.author ? item.author.split('@')[0] : 'A player';
                    } else {
                        authorDisplay = 'A player';
                    }
                    let attachmentsHTML = '';
                    if (item.attachments && item.attachments.length > 0) {
                        attachmentsHTML = `<div class="flex flex-wrap gap-2 mt-2">${item.attachments.map(att => `<img src="${att.url}" class="max-w-[100px]" style="image-rendering: pixelated;"/>`).join('')}</div>`;
                    }
                    itemEl.innerHTML = `<div class="markdown-content text-lg text-slate-300">${marked.parse(item.text || '')}</div>${attachmentsHTML}<p class="text-sm text-slate-500 mt-1"><strong>${authorDisplay}</strong> commented - ${itemDate}</p>`;
                } else {
                    itemEl.className = 'activity-item activity-event';
                    let userDisplay;
                    if (item.user === ADMIN_EMAIL) {
                        userDisplay = 'An admin';
                    } else if (isUserAdmin) {
                        userDisplay = item.user ? item.user.split('@')[0] : 'A player';
                    } else {
                         userDisplay = 'A player';
                    }
                    itemEl.innerHTML = `<p><strong>${userDisplay}</strong> ${item.text} - <span class="text-sm">${itemDate}</span></p>`;
                }
                timelineList.appendChild(itemEl);
            });
        });
        
        closeTimelineBtn.addEventListener('click', () => {
             activityTimelineModal.style.display = 'none';
        });

        activityTimelineModal.addEventListener('click', (e) => {
            if (e.target === activityTimelineModal) {
                activityTimelineModal.style.display = 'none';
            }
        });

        // --- SCROLL TO TOP LOGIC ---
        window.addEventListener('scroll', () => {
            // The threshold is set to 800px, which is roughly one full viewport height.
            if (window.scrollY > 800) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });


        // --- PAGE NAVIGATION LOGIC ---
        function openNavPanel() {
            navPanel.classList.remove('-translate-x-full');
            navToggleBtn.classList.add('panel-open');
            const panelWidth = navPanel.offsetWidth;
            navToggleBtn.style.transform = `translateX(${panelWidth}px)`;
        }

        function closeNavPanel() {
            navPanel.classList.add('-translate-x-full');
            navToggleBtn.classList.remove('panel-open');
            navToggleBtn.style.transform = 'translateX(0px)';
        }

        navToggleBtn.addEventListener('click', () => {
            if (navToggleBtn.classList.contains('panel-open')) {
                closeNavPanel();
            } else {
                openNavPanel();
            }
        });

        goToTrackerBtn.addEventListener('click', () => {
            suggestionsPage.style.display = 'none';
            bugTrackerPage.style.display = 'block';
            closeNavPanel();
        });

        goToSuggestionsBtn.addEventListener('click', () => {
            bugTrackerPage.style.display = 'none';
            suggestionsPage.style.display = 'block';
            closeNavPanel();
        });


        // --- EASTER EGG ---
        let physicsActive = false;
        let physicsObjects = [];
        let animationFrameId = null;

        const secretCode = ['6', '7', '6', '7', '6', '7'];
        let keySequence = [];

        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            keySequence.push(e.key);
            keySequence = keySequence.slice(-secretCode.length);

            if (keySequence.join('') === secretCode.join('')) {
                togglePhysicsEasterEgg();
                keySequence = [];
            }
        });

        function togglePhysicsEasterEgg() {
            physicsActive = !physicsActive;
            if (physicsActive) {
                initPhysics();
            } else {
                resetPhysics();
            }
        }
        
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
            const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

            if (rect.width <= 0 || rect.height <= 0) {
                return false;
            }

            // Calculate the area of the element that is visible
            const visibleX = Math.max(0, Math.min(rect.right, windowWidth) - Math.max(rect.left, 0));
            const visibleY = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
            const visibleArea = visibleX * visibleY;

            const totalArea = rect.width * rect.height;

            // Check if at least 75% of the element's area is visible
            return (visibleArea / totalArea) >= 0.75;
        }

        function initPhysics() {
            document.body.classList.add('physics-active');
            const mainPanels = [
                document.getElementById('dashboard'),
                document.getElementById('bug-form-container'),
                document.querySelector('#bug-list-wrapper > .flex') // The filter/header bar
            ];

            const elementsToFloat = [];
            
            mainPanels.forEach(el => {
                if (el && el.style.display !== 'none' && isElementInViewport(el)) {
                    elementsToFloat.push(el);
                }
            });

            const bugItems = document.querySelectorAll('#bug-list > .ui-panel');
            bugItems.forEach(bugEl => {
                if (isElementInViewport(bugEl)) {
                    elementsToFloat.push(bugEl);
                }
            });

            physicsObjects = [];
            
            elementsToFloat.forEach(el => {
                const rect = el.getBoundingClientRect();

                // Create and insert placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'physics-placeholder';
                placeholder.style.height = `${rect.height}px`;
                placeholder.style.marginTop = getComputedStyle(el).marginTop;
                placeholder.style.marginBottom = getComputedStyle(el).marginBottom;
                el.parentNode.insertBefore(placeholder, el);

                // Make the element a physics object
                el.classList.add('physics-object');
                el.style.left = `${rect.left}px`;
                el.style.top = `${rect.top}px`;
                el.style.width = `${rect.width}px`;
                
                physicsObjects.push({
                    el: el,
                    x: rect.left,
                    y: rect.top,
                    vx: Math.random() * 4 - 2,
                    vy: Math.random() * -5 - 5
                });
            });

            if(animationFrameId) cancelAnimationFrame(animationFrameId);
            updatePhysics();
        }

        function updatePhysics() {
            const gravity = 0.2;
            const bounceFactor = 0.7;

            // 1. Update positions and handle wall collisions first
            physicsObjects.forEach(obj => {
                obj.vy += gravity;
                obj.x += obj.vx;
                obj.y += obj.vy;

                const rect = { width: obj.el.offsetWidth, height: obj.el.offsetHeight };
                
                if (obj.x + rect.width > window.innerWidth || obj.x < 0) {
                    obj.vx *= -bounceFactor;
                    obj.x = Math.max(0, Math.min(obj.x, window.innerWidth - rect.width));
                }
                if (obj.y + rect.height > window.innerHeight) {
                     obj.vy *= -bounceFactor;
                     obj.y = window.innerHeight - rect.height;
                }
                 if (obj.y < 0) {
                    obj.vy *= -bounceFactor;
                    obj.y = 0;
                }
            });
            
            // 2. Handle object-to-object collisions
            for (let i = 0; i < physicsObjects.length; i++) {
                for (let j = i + 1; j < physicsObjects.length; j++) {
                    const objA = physicsObjects[i];
                    const objB = physicsObjects[j];
                    const rectA = { width: objA.el.offsetWidth, height: objA.el.offsetHeight };
                    const rectB = { width: objB.el.offsetWidth, height: objB.el.offsetHeight };

                    // Simple AABB collision check
                    if (objA.x < objB.x + rectB.width &&
                        objA.x + rectA.width > objB.x &&
                        objA.y < objB.y + rectB.height &&
                        objA.y + rectA.height > objB.y) 
                    {
                        // Rudimentary collision response
                        const overlapX = Math.min(objA.x + rectA.width, objB.x + rectB.width) - Math.max(objA.x, objB.x);
                        const overlapY = Math.min(objA.y + rectA.height, objB.y + rectB.height) - Math.max(objA.y, objB.y);

                        if (overlapX < overlapY) { // Horizontal collision
                            const tempVx = objA.vx;
                            objA.vx = objB.vx;
                            objB.vx = tempVx;
                            if (objA.x < objB.x) {
                                objA.x -= overlapX / 2;
                                objB.x += overlapX / 2;
                            } else {
                                objA.x += overlapX / 2;
                                objB.x -= overlapX / 2;
                            }
                        } else { // Vertical collision
                            const tempVy = objA.vy;
                            objA.vy = objB.vy;
                            objB.vy = tempVy;
                             if (objA.y < objB.y) {
                                objA.y -= overlapY / 2;
                                objB.y += overlapY / 2;
                            } else {
                                objA.y += overlapY / 2;
                                objB.y -= overlapY / 2;
                            }
                        }
                    }
                }
            }

            // 3. Apply final transformations to all elements
            physicsObjects.forEach(obj => {
                obj.el.style.transform = `translate(${obj.x - parseFloat(obj.el.style.left)}px, ${obj.y - parseFloat(obj.el.style.top)}px)`;
            });


            animationFrameId = requestAnimationFrame(updatePhysics);
        }

        function resetPhysics() {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            document.body.classList.remove('physics-active');
            
            document.querySelectorAll('.physics-placeholder').forEach(p => p.remove());

            physicsObjects.forEach(obj => {
                obj.el.classList.remove('physics-object');
                obj.el.style.left = '';
                obj.el.style.top = '';
                obj.el.style.width = '';
                obj.el.style.transform = '';
            });
            physicsObjects = [];
        }

    </script>

</body>
</html>


