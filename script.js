document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Define the dungeon structure as a tree
    const dungeonStructure = {
        name: "C:\\",
        type: "directory",
        children: [
            {
                name: "FortressLore.txt",
                type: "text-file",
                content: "This ancient fortress was built to protect valuable knowledge. Legend says there's a hidden treasure for those who can navigate its depths..."
            },
            {
                name: "README.md",
                type: "md-file",
                content: "Welcome to the CLI Dungeon Crawl! Navigate through the directory structure to find the hidden treasure. Use the 'cd' command to move between directories, 'dir' to list contents, and 'type' to read files."
            },
            {
                name: "EntranceGrounds",
                type: "directory",
                children: [
                    {
                        name: "Gatehouse.info",
                        type: "info-file",
                        content: "The gatehouse stands tall, its ancient doors opened inward. Passages lead to the outer walls."
                    },
                    {
                        name: "OuterWalls",
                        type: "directory",
                        children: [
                            {
                                name: "CrumblingTower.look",
                                type: "look-file",
                                content: "A crumbling tower with stairs leading nowhere. There's a small storage room nearby."
                            },
                            {
                                name: "StorageRoom",
                                type: "directory",
                                content: "An empty storage room with dust-covered shelves."
                            },
                            {
                                name: "InnerKeep",
                                type: "directory",
                                children: [
                                    {
                                        name: "GreatHall.info",
                                        type: "info-file",
                                        content: "A massive hall with high ceilings. Passages lead to various rooms, including one with a locked door."
                                    },
                                    {
                                        name: "OldRecords.tome",
                                        type: "tome-file",
                                        content: "Ancient records speak of a stone key that unlocks the forbidden library, where treasures of knowledge await."
                                    },
                                    {
                                        name: "OpenedDoor",
                                        type: "directory",
                                        children: [
                                            {
                                                name: "ForbiddenLibrary",
                                                type: "directory",
                                                children: [
                                                    {
                                                        name: "ReadingChamber",
                                                        type: "directory",
                                                        children: [
                                                            {
                                                                name: "Treasure.txt",
                                                                type: "text-file",
                                                                content: "Congratulations! You have found the treasure! The true treasure was the command line knowledge you gained along the way."
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        name: "StoneKey.key",
                                        type: "key-file",
                                        content: "An ancient stone key that seems to fit a special lock. Perhaps it opens a door to forbidden knowledge."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    // Generate the visual map
    const dungeonMap = document.getElementById('dungeon-map');
    const infoPanel = document.getElementById('info-panel');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');
    const cliDisplay = document.getElementById('cli-display');
    
    // Node positions (manually set for a nice layout)
    const nodePositions = {
        "C:\\": { x: 50, y: 10, width: 120, height: 40 },
        "FortressLore.txt": { x: 10, y: 70, width: 150, height: 40 },
        "README.md": { x: 170, y: 70, width: 120, height: 40 },
        "EntranceGrounds": { x: 300, y: 70, width: 150, height: 40 },
        "Gatehouse.info": { x: 230, y: 130, width: 140, height: 40 },
        "OuterWalls": { x: 380, y: 130, width: 120, height: 40 },
        "CrumblingTower.look": { x: 250, y: 190, width: 160, height: 40 },
        "StorageRoom": { x: 420, y: 190, width: 130, height: 40 },
        "InnerKeep": { x: 560, y: 190, width: 120, height: 40 },
        "GreatHall.info": { x: 440, y: 250, width: 140, height: 40 },
        "OldRecords.tome": { x: 590, y: 250, width: 150, height: 40 },
        "OpenedDoor": { x: 750, y: 250, width: 120, height: 40 },
        "StoneKey.key": { x: 630, y: 310, width: 130, height: 40 },
        "ForbiddenLibrary": { x: 770, y: 310, width: 150, height: 40 },
        "ReadingChamber": { x: 780, y: 370, width: 150, height: 40 },
        "Treasure.txt": { x: 780, y: 430, width: 130, height: 40 }
    };
    
    // Node connections
    const connections = [
        { from: "C:\\", to: "FortressLore.txt" },
        { from: "C:\\", to: "README.md" },
        { from: "C:\\", to: "EntranceGrounds" },
        { from: "EntranceGrounds", to: "Gatehouse.info" },
        { from: "EntranceGrounds", to: "OuterWalls" },
        { from: "OuterWalls", to: "CrumblingTower.look" },
        { from: "OuterWalls", to: "StorageRoom" },
        { from: "OuterWalls", to: "InnerKeep" },
        { from: "InnerKeep", to: "GreatHall.info" },
        { from: "InnerKeep", to: "OldRecords.tome" },
        { from: "InnerKeep", to: "OpenedDoor" },
        { from: "InnerKeep", to: "StoneKey.key" },
        { from: "OpenedDoor", to: "ForbiddenLibrary" },
        { from: "ForbiddenLibrary", to: "ReadingChamber" },
        { from: "ReadingChamber", to: "Treasure.txt" }
    ];

    // Create nodes
    function createNodes() {
        // First, draw connections for proper z-index
        connections.forEach(conn => {
            const fromPos = nodePositions[conn.from];
            const toPos = nodePositions[conn.to];
            
            const connector = document.createElement('div');
            connector.className = 'connector';
            
            // Calculate connector position and dimensions
            const x1 = fromPos.x + fromPos.width / 2;
            const y1 = fromPos.y + fromPos.height / 2;
            const x2 = toPos.x + toPos.width / 2;
            const y2 = toPos.y + toPos.height / 2;
            
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            
            connector.style.width = `${length}px`;
            connector.style.height = '2px';
            connector.style.left = `${x1}px`;
            connector.style.top = `${y1}px`;
            connector.style.transform = `rotate(${angle}deg)`;
            
            dungeonMap.appendChild(connector);
        });
        
        // Then create node elements
        Object.keys(nodePositions).forEach(nodeName => {
            const pos = nodePositions[nodeName];
            const node = document.createElement('div');
            
            // Determine node type
            let nodeType = 'directory';
            if (nodeName.endsWith('.txt')) nodeType = 'text-file';
            else if (nodeName.endsWith('.info')) nodeType = 'info-file';
            else if (nodeName.endsWith('.key')) nodeType = 'key-file';
            else if (nodeName.endsWith('.look')) nodeType = 'look-file';
            else if (nodeName.endsWith('.tome')) nodeType = 'tome-file';
            else if (nodeName.endsWith('.md')) nodeType = 'md-file';
            
            node.className = `map-node ${nodeType}`;
            node.textContent = nodeName;
            node.style.left = `${pos.x}px`;
            node.style.top = `${pos.y}px`;
            node.style.width = `${pos.width}px`;
            node.style.height = `${pos.height}px`;
            
            node.addEventListener('click', () => {
                // Clear previously selected node
                document.querySelectorAll('.map-node.active').forEach(n => n.classList.remove('active'));
                
                // Mark this node as active
                node.classList.add('active');
                
                // Find node content
                const nodeInfo = findNodeInfo(dungeonStructure, nodeName);
                
                if (nodeInfo) {
                    infoTitle.textContent = nodeName;
                    
                    // Display content
                    if (nodeInfo.content) {
                        infoContent.innerHTML = `<p>${nodeInfo.content}</p>`;
                    } else {
                        infoContent.innerHTML = `<p>A ${nodeType.replace('-file', '')} location in the dungeon.</p>`;
                    }
                    
                    // Update CLI display
                    updateCliDisplay(nodeName);
                }
            });
            
            dungeonMap.appendChild(node);
        });
    }
    
    // Find node info from the structure
    function findNodeInfo(structure, nodeName) {
        if (structure.name === nodeName) {
            return structure;
        }
        
        if (structure.children) {
            for (const child of structure.children) {
                const result = findNodeInfo(child, nodeName);
                if (result) return result;
            }
        }
        
        return null;
    }
    
    // Update CLI display based on selected node
    function updateCliDisplay(nodeName) {
        let path = '';
        let commands = '';
        
        // Build path based on node name
        if (nodeName === "C:\\") {
            path = "C:\\";
            commands = `<p class="command">C:\\> dir</p>
                       <p class="response">Directory of C:\\</p>
                       <p class="response">FortressLore.txt</p>
                       <p class="response">README.md</p>
                       <p class="response">EntranceGrounds</p>`;
        } else if (nodeName === "FortressLore.txt") {
            path = "C:\\";
            commands = `<p class="command">C:\\> type FortressLore.txt</p>
                       <p class="response">This ancient fortress was built to protect valuable knowledge. Legend says there's a hidden treasure for th
