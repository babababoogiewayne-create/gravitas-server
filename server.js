// A simple WebSocket server for Gravitas multiplayer

const WebSocket = require('ws');
const { createNoise2D, createNoise3D } = require('simplex-noise');

const SEED = Math.random().toString();

// --- NEW: Vector3 and Box3 classes for server-side physics ---
// A simplified version of THREE.js classes for server use.
class Vector3 {
    constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
    copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
    add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
    multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
    lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }
    length() { return Math.sqrt(this.lengthSq()); }
    normalize() { const l = this.length(); if (l > 0) this.multiplyScalar(1 / l); return this; }
    clone() { return new Vector3(this.x, this.y, this.z); }
    projectOnPlane(planeNormal) {
        const projected = this.clone().projectOnVector(planeNormal);
        return this.sub(projected);
    }
    projectOnVector(vector) {
        const scalar = vector.dot(this) / vector.lengthSq();
        return vector.clone().multiplyScalar(scalar);
    }
}
class Box3 {
    constructor(min = new Vector3(Infinity, Infinity, Infinity), max = new Vector3(-Infinity, -Infinity, -Infinity)) {
        this.min = min;
        this.max = max;
    }
    setFromCenterAndSize(center, size) {
        const halfSize = size.clone().multiplyScalar(0.5);
        this.min.copy(center).sub(halfSize);
        this.max.copy(center).add(halfSize);
        return this;
    }
    intersectsBox(box) {
        return !(box.max.x < this.min.x || box.min.x > this.max.x ||
                 box.max.y < this.min.y || box.min.y > this.max.y ||
                 box.max.z < this.min.z || box.min.z > this.max.z);
    }
    getCenter(target) {
        return target.copy(this.min).add(this.max).multiplyScalar(0.5);
    }
}
// Quaternion class for rotations (simplified)
class Quaternion {
    constructor(x = 0, y = 0, z = 0, w = 1) { this.x = x; this.y = y; this.z = z; this.w = w; }
    setFromUnitVectors(vFrom, vTo) {
        // Simplified implementation
        let r = vFrom.dot(vTo) + 1;
        if (r < 0.000001) {
            r = 0;
            if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                this.x = -vFrom.y; this.y = vFrom.x; this.z = 0; this.w = r;
            } else {
                this.x = 0; this.y = -vFrom.z; this.z = vFrom.y; this.w = r;
            }
        } else {
            this.x = vFrom.y * vTo.z - vFrom.z * vTo.y;
            this.y = vFrom.z * vTo.x - vFrom.x * vTo.z;
            this.z = vFrom.x * vTo.y - vFrom.y * vTo.x;
            this.w = r;
        }
        return this.normalize();
    }
    normalize() {
        const l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        if (l === 0) {
            this.x = 0; this.y = 0; this.z = 0; this.w = 1;
        } else {
            const invl = 1 / l;
            this.x *= invl; this.y *= invl; this.z *= invl; this.w *= invl;
        }
        return this;
    }
    slerp(qb, t) {
        // Simplified slerp
        const x0 = this.x, y0 = this.y, z0 = this.z, w0 = this.w;
        const x1 = qb.x, y1 = qb.y, z1 = qb.z, w1 = qb.w;
        if (t === 0) { return this; }
        if (t === 1) { this.x=x1; this.y=y1; this.z=z1; this.w=w1; return this; }
        const kx = ( 1 - t ) * x0 + t * x1;
        const ky = ( 1 - t ) * y0 + t * y1;
        const kz = ( 1 - t ) * z0 + t * z1;
        const kw = ( 1 - t ) * w0 + t * w1;
        this.x = kx; this.y = ky; this.z = kz; this.w = kw;
        return this.normalize();
    }
    premultiply(q) {
        const qax = q.x, qay = q.y, qaz = q.z, qaw = q.w;
        const qbx = this.x, qby = this.y, qbz = this.z, qbw = this.w;
        this.x = qaw * qbx + qax * qbw + qay * qbz - qaz * qby;
        this.y = qaw * qby - qax * qbz + qay * qbw + qaz * qbx;
        this.z = qaw * qbz + qax * qby - qay * qbx + qaz * qbw;
        this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
        return this;
    }
     angleTo( q ) {
		return 2 * Math.acos( Math.abs( Math.min( Math.max( this.dot( q ), - 1 ), 1 ) ) );
	}
    dot( v ) {
		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
	}
}
Vector3.prototype.applyQuaternion = function (q) {
    const x = this.x, y = this.y, z = this.z;
    const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
};

// --- OBB COLLISION LOGIC (from original file) ---
// This entire section is transplanted from your single-player code for server-side use.
function getOBBCorners(obb) {
    const corners = [];
    const C = obb.center;
    const E = obb.halfExtents;
    const A = obb.axes;
    const u0 = A[0].clone().multiplyScalar(E.x);
    const u1 = A[1].clone().multiplyScalar(E.y);
    const u2 = A[2].clone().multiplyScalar(E.z);
    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            for (let k = -1; k <= 1; k += 2) {
                corners.push(C.clone().add(u0.clone().multiplyScalar(i)).add(u1.clone().multiplyScalar(j)).add(u2.clone().multiplyScalar(k)));
            }
        }
    }
    return corners;
}

function getCollisionMTV(obb, aabb) {
    const obbAxes = obb.axes;
    const worldAxes = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)];
    let minOverlap = Infinity;
    let mtvAxis = null;
    const project = (vertices, axis) => {
        let min = Infinity, max = -Infinity;
        for (const v of vertices) {
            const proj = v.dot(axis);
            min = Math.min(min, proj);
            max = Math.max(max, proj);
        }
        return { min, max };
    };
    const getOverlap = (proj1, proj2) => {
        return Math.max(0, Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min));
    };
    const getAABBCorners = (aabb) => {
        return [
            new Vector3(aabb.min.x, aabb.min.y, aabb.min.z), new Vector3(aabb.max.x, aabb.min.y, aabb.min.z),
            new Vector3(aabb.min.x, aabb.max.y, aabb.min.z), new Vector3(aabb.max.x, aabb.max.y, aabb.min.z),
            new Vector3(aabb.min.x, aabb.min.y, aabb.max.z), new Vector3(aabb.max.x, aabb.min.y, aabb.max.z),
            new Vector3(aabb.min.x, aabb.max.y, aabb.max.z), new Vector3(aabb.max.x, aabb.max.y, aabb.max.z),
        ];
    };
    const obbCorners = getOBBCorners(obb);
    const aabbCorners = getAABBCorners(aabb);
    for (const axis of worldAxes) {
        const proj1 = project(obbCorners, axis); const proj2 = project(aabbCorners, axis);
        const overlap = getOverlap(proj1, proj2); if (overlap === 0) return null;
        if (overlap < minOverlap) { minOverlap = overlap; mtvAxis = axis; }
    }
    for (const axis of obbAxes) {
        const proj1 = project(obbCorners, axis); const proj2 = project(aabbCorners, axis);
        const overlap = getOverlap(proj1, proj2); if (overlap === 0) return null;
        if (overlap < minOverlap) { minOverlap = overlap; mtvAxis = axis; }
    }
    if (!mtvAxis) return null;
    const mtv = mtvAxis.clone().multiplyScalar(minOverlap);
    const direction = obb.center.clone().sub(aabb.getCenter(new Vector3()));
    if (direction.dot(mtv) < 0) { mtv.multiplyScalar(-1); }
    return mtv;
}
function getCollisionMTV_OBB_OBB(obbA, obbB) {
    let minOverlap = Infinity;
    let mtvAxis = null;

    const project = (vertices, axis) => {
        let min = Infinity, max = -Infinity;
        for (const v of vertices) {
            const proj = v.dot(axis);
            min = Math.min(min, proj);
            max = Math.max(max, proj);
        }
        return { min, max };
    };

    const getOverlap = (proj1, proj2) => {
        return Math.max(0, Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min));
    };

    const cornersA = getOBBCorners(obbA);
    const cornersB = getOBBCorners(obbB);

    const axes = [...obbA.axes, ...obbB.axes];

    for (const axis of axes) {
        if (axis.lengthSq() < 0.0001) continue;
        const projA = project(cornersA, axis);
        const projB = project(cornersB, axis);
        const overlap = getOverlap(projA, projB);
        if (overlap === 0) return null; // Found a separating axis

        if (overlap < minOverlap) {
            minOverlap = overlap;
            mtvAxis = axis;
        }
    }

    if (!mtvAxis) return null;

    const mtv = mtvAxis.clone().multiplyScalar(minOverlap);
    const direction = obbA.center.clone().sub(obbB.center);
    if (direction.dot(mtv) < 0) {
        mtv.multiplyScalar(-1);
    }
    return mtv;
}


// Create a WebSocket server on port 8080
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

// A map to store connected clients (players) and their data
const clients = new Map();

// --- SERVER-SIDE STATE MANAGEMENT ---
const worldChanges = new Map();
const mobs = new Map(); // Mobs (like slimes) are now managed by the server
let nextMobId = 0;

// --- REVISED: SERVER-SIDE WORLD GENERATION ---
const world = new Map(); // The server's understanding of the world
const wonderiteSources = new Map(); // NEW: Server now tracks Wonderite
const worldSize = 128;
const worldHeight = 64;
const chunkSize = 16;
const seaLevel = -12;
const bottomOfTheWorld = -worldHeight / 2;

const noise3D = createNoise3D(() => SEED);
const terrainNoise = createNoise2D(() => SEED);
const caveOpeningNoise = createNoise2D(() => SEED + '-caves');

// --- NEW: World utility functions for the server ---
function getVoxelKey(x, y, z) { return `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`; }
const getBlock = (x, y, z) => world.get(getVoxelKey(x, y, z));
function addBlock(x, y, z, type = 'grass') {
    const key = getVoxelKey(x, y, z);
    world.set(key, { type });
    if (type === 'wonderite_block' || type === 'wonderite_block_cube') {
        wonderiteSources.set(key, { 
            position: new Vector3(x + 0.5, y + 0.5, z + 0.5), 
            type: type === 'wonderite_block' ? 'sphere' : 'cube' 
        });
    }
}
function removeBlock(x, y, z) {
    const key = getVoxelKey(x, y, z);
    const block = world.get(key);
    if (block && (block.type === 'wonderite_block' || block.type === 'wonderite_block_cube')) {
        wonderiteSources.delete(key);
    }
    world.delete(key);
}
function getGroundHeight(x, z) {
    for (let y = worldHeight; y > -worldHeight; y--) {
        const block = getBlock(x, y, z);
        if (block && block.type !== 'water' && block.type !== 'leaf') return y;
    }
    return 0;
}

function generateTree(x, y, z) {
    // A simple psuedo-random number generator using the seed and position
    const random = (seed) => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    const seed = (x * 100 + z) * 1000 + y;
    const trunkHeight = Math.floor(random(seed) * 3) + 4;
    for (let i = 0; i < trunkHeight; i++) { addBlock(x, y + i, z, 'log'); }
    const topLogY = y + trunkHeight - 1;
    if (!getBlock(x, topLogY + 1, z)) addBlock(x, topLogY + 1, z, 'leaf'); 
    if (!getBlock(x + 1, topLogY, z)) addBlock(x + 1, topLogY, z, 'leaf'); 
    if (!getBlock(x - 1, topLogY, z)) addBlock(x - 1, topLogY, z, 'leaf'); 
    if (!getBlock(x, topLogY, z + 1)) addBlock(x, topLogY, z + 1, 'leaf'); 
    if (!getBlock(x, topLogY, z - 1)) addBlock(x, topLogY, z - 1, 'leaf'); 
    const leafRadius = 2;
    for (let ly = y + trunkHeight - 2; ly < y + trunkHeight + 2; ly++) {
        for (let lx = x - leafRadius; lx <= x + leafRadius; lx++) {
            for (let lz = z - leafRadius; lz <= z + leafRadius; lz++) {
                const distSq = (lx - x)**2 + (lz - z)**2 + ((ly - (y + trunkHeight - 1)) * 1.5)**2;
                if (distSq < leafRadius**2 && !getBlock(lx, ly, lz)) {
                    if (random(lx * lz * ly) > 0.1) { addBlock(lx, ly, lz, 'leaf'); }
                }
            }
        }
    }
}


// --- NEW: Generate the world on server startup ---
function generateWorld() {
    console.log('[Server] Generating world terrain...');
    for (let x = -worldSize / 2; x < worldSize / 2; x++) {
        for (let z = -worldSize / 2; z < worldSize / 2; z++) {
            const continentalness = terrainNoise(x * 0.005, z * 0.005) * 20;
            const hills = terrainNoise(x * 0.02, z * 0.02) * 5;
            const roughness = terrainNoise(x * 0.1, z * 0.1) * 2;
            const surfaceY = Math.floor(continentalness + hills + roughness);
            addBlock(x, bottomOfTheWorld, z, 'bedrock');
            for (let y = bottomOfTheWorld + 1; y < surfaceY - 4; y++) {
                addBlock(x, y, z, 'stone');
            }
            for (let y = surfaceY - 4; y < surfaceY; y++) {
                addBlock(x, y, z, 'dirt');
            }
            if (surfaceY >= seaLevel) {
                addBlock(x, surfaceY, z, 'grass');
            } else {
                addBlock(x, surfaceY, z, 'gravel'); 
            }
        }
    }
    console.log('[Server] Generating caves...');
    const caveNoiseScaleHorizontal = 0.05; 
    const caveNoiseScaleVertical = 0.12;
    const caveThreshold = 0.7; 
    for (let x = -worldSize / 2; x < worldSize / 2; x++) {
        for (let z = -worldSize / 2; z < worldSize / 2; z++) {
            const surfaceY = getGroundHeight(x, z);
            for (let y = bottomOfTheWorld + 1; y < surfaceY - 4; y++) {
                const noiseValue = (noise3D(x * caveNoiseScaleHorizontal, y * caveNoiseScaleVertical, z * caveNoiseScaleHorizontal) + 1) / 2;
                if (noiseValue > caveThreshold) {
                    removeBlock(x, y, z); 
                }
            }
        }
    }

    console.log('[Server] Generating water and beaches...');
    for (let x = -worldSize / 2; x < worldSize / 2; x++) {
        for (let z = -worldSize / 2; z < worldSize / 2; z++) {
            const groundY = getGroundHeight(x, z);
            if (groundY < seaLevel) {
                for (let y = seaLevel; y > groundY; y--) {
                    if (!getBlock(x, y, z)) { 
                        addBlock(x, y, z, 'water'); 
                    }
                }
            }
        }
    }

     console.log('[Server] Generating trees...');
      for (let x = -worldSize / 2; x < worldSize / 2; x++) {
        for (let z = -worldSize / 2; z < worldSize / 2; z++) {
            const y = getGroundHeight(x, z);
            const blockOnGround = getBlock(x, y, z);
            if (blockOnGround && blockOnGround.type === 'grass' && y >= seaLevel) {
                 const random = (seed) => {
                    let t = seed += 0x6D2B79F5;
                    t = Math.imul(t ^ t >>> 15, t | 1);
                    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
                    return ((t ^ t >>> 14) >>> 0) / 4294967296;
                }
                if (random(x * 1000 + z) < 0.02) { 
                    generateTree(x, y + 1, z);
                }
            }
        }
    }

    console.log('[Server] World generation complete.');
}
generateWorld();

// --- SERVER LOGIC ---
console.log(`Gravitas server is listening on port ${PORT}`);

// Helper function to broadcast a message to all clients (can exclude the sender)
function broadcast(message, senderId = null) {
    const messageString = JSON.stringify(message);
    for (const [clientId, client] of clients.entries()) {
        if (clientId !== senderId && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(messageString);
        }
    }
}

// Function to spawn a slime on the server
function spawnSlime() {
    const mobId = `slime-${nextMobId++}`;
    const spawnX = (Math.random() - 0.5) * 40;
    const spawnZ = (Math.random() - 0.5) * 40;
    const spawnY = getGroundHeight(spawnX, spawnZ) + 5;

    const slime = {
        id: mobId,
        type: 'slime',
        position: new Vector3(spawnX, spawnY, spawnZ),
        velocity: new Vector3(),
        size: 1.0 / Math.cbrt(2), // Base size from original code
        onGround: false,
        jumpCooldown: Math.random() * 3 + 1,
        combineCooldown: 0,
        isCarriedBy: null, // NEW: Track who is carrying the slime
        // --- NEW: Add personal orientation vectors for slimes ---
        up: new Vector3(0, 1, 0),
        gravityDirection: new Vector3(0, -1, 0),
        quaternion: new Quaternion(),
        // --- NEW: Add physics objects ---
        obb: { 
            center: new Vector3(),
            halfExtents: new Vector3(),
            quaternion: new Quaternion(),
            axes: [new Vector3(1,0,0), new Vector3(0,1,0), new Vector3(0,0,1)]
        },
        hitbox: new Box3()
    };
    mobs.set(mobId, slime);

    // Tell everyone a new slime has spawned
    broadcast({ type: 'mobSpawn', mob: serializeMob(slime) });
    console.log(`[Server] Spawned slime ${mobId} at ${spawnX.toFixed(1)}, ${spawnY.toFixed(1)}, ${spawnZ.toFixed(1)}`);
}

// Helper to serialize mob data for sending to clients
function serializeMob(mob) {
    return {
        id: mob.id,
        type: mob.type,
        position: mob.position,
        velocity: mob.velocity,
        size: mob.size,
        onGround: mob.onGround,
        quaternion: mob.quaternion, // Send orientation
        isCarriedBy: mob.isCarriedBy // Send carry status
    };
}


// Spawn some slimes to start
setTimeout(() => {
    for(let i = 0; i < 15; i++) {
        spawnSlime();
    }
}, 5000);

wss.on('connection', (ws) => {
    // Generate a simple unique ID for the new player
    const playerId = `player-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(`[Server] Player ${playerId} connected.`);

    // Store the connection and initialize player data
    const metadata = { 
        ws, 
        id: playerId,
        data: {
            position: new Vector3(0, 35, 0),
            velocity: new Vector3(), // NEW: Server now tracks player velocity for bounce physics
            quaternion: { x: 0, y: 0, z: 0, w: 1 },
            headQuaternion: { x: 0, y: 0, z: 0, w: 1 },
            skin: 'Pega_Dliekfeldt' // Default skin
        }
    };
    clients.set(playerId, metadata);

    // --- REVISED: Send the new player their unique ID AND the entire world ---
    ws.send(JSON.stringify({ type: 'welcome', id: playerId }));

    // 2. Send the COMPLETE world state (not just changes)
    console.log('[Server] Sending complete world to player...');
    const completeWorld = [];
    for (const [key, block] of world.entries()) {
        completeWorld.push([key, block.type]);
    }
    ws.send(JSON.stringify({ type: 'worldState', changes: completeWorld }));
    console.log(`[Server] Sent ${completeWorld.length} blocks to player ${playerId}`);
    
    // 3. Send the state of all existing mobs
    ws.send(JSON.stringify({ type: 'mobsUpdate', mobs: Array.from(mobs.values()).map(serializeMob) }));

    // 4. Send the new player the data of all already-connected players
    const existingPlayers = [];
    for (const [id, client] of clients.entries()) {
        if (id !== playerId) {
            existingPlayers.push({ id: client.id, data: client.data });
        }
    }
    ws.send(JSON.stringify({ type: 'existingPlayers', players: existingPlayers }));

    // 5. Announce the new player to everyone else
    const playerJoinedMessage = {
        type: 'playerJoined',
        player: { id: playerId, data: metadata.data }
    };
    broadcast(playerJoinedMessage, playerId);


    // Handle incoming messages from this client
    ws.on('message', (messageAsString) => {
        try {
            const message = JSON.parse(messageAsString);
            const sender = clients.get(playerId);

            if (!sender) return;

            // Handle different message types
            switch (message.type) {
                case 'playerMoved':
                    sender.data.position = message.data.position;
                    sender.data.velocity = message.data.velocity; // NEW: Receive player velocity
                    sender.data.quaternion = message.data.quaternion;
                    sender.data.headQuaternion = message.data.headQuaternion;
                    broadcast({ type: 'playerMoved', id: playerId, data: sender.data }, playerId);
                    break;
                
                case 'blockBroken':
                    {
                        const {x, y, z} = message.pos;
                        const blockKey = `${x},${y},${z}`;
                        worldChanges.set(blockKey, null);
                        removeBlock(x,y,z);
        
                        // Broadcast to all other clients
                        broadcast({ 
                            type: 'blockBroken', 
                            pos: message.pos, 
                            id: playerId 
                        }, playerId);
                    }
                    break;

                case 'blockPlaced':
                    {
                        const {x, y, z} = message.pos;
                        const blockKey = `${x},${y},${z}`;
                        worldChanges.set(blockKey, message.blockType);
                        addBlock(x, y, z, message.blockType);
        
                        // Broadcast to all other clients
                        broadcast({ 
                            type: 'blockPlaced', 
                            pos: message.pos, 
                            blockType: message.blockType, 
                            id: playerId 
                        }, playerId);
                    }
                    break;
                
                case 'skinChanged':
                    sender.data.skin = message.skin;
                    broadcast({ type: 'skinChanged', id: playerId, skin: message.skin }, playerId);
                    break;
                
                 case 'requestCarrySlime': {
                    const slime = mobs.get(message.mobId);
                    const player = clients.get(playerId);
                    if (slime && player) {
                        if (slime.isCarriedBy === playerId) { // Drop the slime
                            slime.isCarriedBy = null;
                            slime.velocity = new Vector3(message.throwVelocity.x, message.throwVelocity.y, message.throwVelocity.z);
                        } else if (!slime.isCarriedBy && slime.size < 1.8) { // Pick up the slime
                            slime.isCarriedBy = playerId;
                            slime.velocity = new Vector3();
                        }
                    }
                    break;
                }
                
                case 'kickMob':
                    {
                        const mob = mobs.get(message.mobId);
                        if (mob) {
                            console.log(`[Server] Player ${playerId} kicked mob ${message.mobId}`);
                            // The client sends the final calculated kick velocity
                            mob.velocity = new Vector3(message.kickVelocity.x, message.kickVelocity.y, message.kickVelocity.z);
                            mob.onGround = false;
                        }
                    }
                    break;
                
                case 'chatMessage':
                    {
                        // Sanitize message to prevent issues
                        const cleanMessage = (message.text || '').substring(0, 100);
                        if (cleanMessage) {
                            console.log(`[Chat] <${playerId}> ${cleanMessage}`);
                            broadcast({ type: 'chatMessage', id: playerId, text: cleanMessage });
                        }
                    }
                    break;
            }
        } catch (error) {
            console.error(`[Server] Failed to handle message from ${playerId}:`, error);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log(`[Server] Player ${playerId} disconnected.`);
        // Drop any slime the player was carrying
        for(const slime of mobs.values()) {
            if (slime.isCarriedBy === playerId) {
                slime.isCarriedBy = null;
            }
        }
        clients.delete(playerId);
        broadcast({ type: 'playerLeft', id: playerId });
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error(`[Server] Error for player ${playerId}:`, error);
    });
});

// --- REVISED: SERVER-SIDE PHYSICS LOOP FOR MOBS ---
let lastTick = Date.now();
setInterval(() => {
    const now = Date.now();
    const delta = (now - lastTick) / 1000.0;
    lastTick = now;

    const gravityMagnitude = 35.0;

    mobs.forEach(mob => {
        // --- CARRYING LOGIC ---
        if (mob.isCarriedBy) {
            const carrier = clients.get(mob.isCarriedBy);
            if (carrier) {
                // The client will handle the visual positioning. The server just needs to keep it attached.
                mob.velocity = new Vector3(); // Stop any movement
            } else {
                mob.isCarriedBy = null; // Carrier disconnected
            }
            return; // Skip physics for carried slimes
        }
        
        // --- GRAVITY & PHYSICS (from original file) ---
        let dominantGravitySource = null;
        let minGravityDistSq = 10 * 10;
        for (const [key, source] of wonderiteSources.entries()) {
            let distSq;
            if (source.type === 'sphere') { distSq = mob.position.distanceToSquared(source.position); }
            else { const cubeBox = new Box3().setFromCenterAndSize(source.position, new Vector3(20, 20, 20)); distSq = cubeBox.containsPoint(mob.position) ? 0 : Infinity; }
            if (distSq < minGravityDistSq) { minGravityDistSq = distSq; dominantGravitySource = source; }
        }
        let targetUp;
        if (dominantGravitySource) {
            if (dominantGravitySource.type === 'sphere') {
                targetUp = mob.position.clone().sub(dominantGravitySource.position).normalize();
            } else {
                const dir = mob.position.clone().sub(dominantGravitySource.position);
                const absX = Math.abs(dir.x), absY = Math.abs(dir.y), absZ = Math.abs(dir.z);
                if (absX > absY && absX > absZ) { targetUp = new Vector3(Math.sign(dir.x), 0, 0); }
                else if (absY > absX && absY > absZ) { targetUp = new Vector3(0, Math.sign(dir.y), 0); }
                else { targetUp = new Vector3(0, 0, Math.sign(dir.z)); }
            }
        } else {
            targetUp = new Vector3(0, 1, 0);
        }
        
        const targetQuat = new Quaternion().setFromUnitVectors(mob.up, targetUp);
        if (targetQuat.angleTo(new Quaternion()) > 0.001) {
            const rotationStep = new Quaternion().slerp(targetQuat, 1 - (10 * delta));
            mob.quaternion.premultiply(rotationStep);
            mob.velocity.applyQuaternion(rotationStep);
        }
        mob.up.copy(new Vector3(0, 1, 0).applyQuaternion(mob.quaternion));
        mob.gravityDirection.copy(mob.up).clone().multiplyScalar(-1);
        
        // --- BEHAVIOR & MOVEMENT ---
        mob.onGround = false; // Check for ground every frame
        const groundCheckPos = mob.position.clone().add(mob.gravityDirection.clone().multiplyScalar(mob.size * 0.5 + 0.1));
        const blockBelow = getBlock(Math.floor(groundCheckPos.x), Math.floor(groundCheckPos.y), Math.floor(groundCheckPos.z));
        if(blockBelow && blockBelow.type !== 'water') mob.onGround = true;

        if (mob.onGround) {
            const groundVelocity = mob.velocity.clone().projectOnPlane(mob.up);
            const speed = groundVelocity.length();
            if (speed > 0) {
                const drop = speed * 15.0 * delta;
                groundVelocity.multiplyScalar(Math.max(0, speed - drop) / speed);
                const verticalVelocity = mob.velocity.clone().projectOnVector(mob.up);
                mob.velocity.copy(groundVelocity).add(verticalVelocity);
            }

            mob.jumpCooldown -= delta;
            if (mob.jumpCooldown <= 0) {
                mob.velocity.add(mob.up.clone().multiplyScalar(6.0 * (mob.size / (1.0 / Math.cbrt(2)))));
                mob.onGround = false;
                mob.jumpCooldown = Math.random() * 3 + 1;
            }
        } else {
            mob.velocity.add(mob.gravityDirection.clone().multiplyScalar(gravityMagnitude * delta));
        }
        
        // --- COLLISION RESOLUTION ---
        mob.position.add(mob.velocity.clone().multiplyScalar(delta));
        // ... (Full OBB collision would go here)
    });
    
    // --- PLAYER-SLIME BOUNCE LOGIC ---
    for(const player of clients.values()) {
        const playerHeight = 1.8, playerWidth = 0.8;
        const playerOBB = {
            center: new Vector3(player.data.position.x, player.data.position.y + playerHeight/2, player.data.position.z),
            halfExtents: new Vector3(playerWidth/2, playerHeight/2, playerWidth/2),
            quaternion: new Quaternion(0,0,0,1), // Simplified for now
            axes: [new Vector3(1,0,0), new Vector3(0,1,0), new Vector3(0,0,1)]
        };

        for(const slime of mobs.values()) {
            if (slime.isCarriedBy) continue;
            
            const slimeOBB = {
                center: slime.position,
                halfExtents: new Vector3(slime.size/2, slime.size/2, slime.size/2),
                quaternion: slime.quaternion,
                axes: [new Vector3(1,0,0), new Vector3(0,1,0), new Vector3(0,0,1)].map(v => v.clone().applyQuaternion(slime.quaternion))
            };

            const mtv = getCollisionMTV_OBB_OBB(playerOBB, slimeOBB);
            if(mtv) {
                const isFallingOnTop = player.data.velocity.y < 0 && mtv.y > 0;
                if(isFallingOnTop) {
                    player.data.velocity.y = 20 * (slime.size / (1.0 / Math.cbrt(2))); // Bounce
                }
            }
        }
    }


    // Broadcast the updated state of all mobs to all players
    broadcast({
        type: 'mobsUpdate',
        mobs: Array.from(mobs.values()).map(serializeMob)
    });

}, 50); // Run physics and send updates 20 times per second

