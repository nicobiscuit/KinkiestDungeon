interface PersistentSpawnAI {
	/** Number of turns between spawn cycles */
	cooldown: number,
	/** Whether or not NPC is willing to spawn */
	filter: (id: number, mapData: KDMapDataType) => boolean,
	/** Chance of wandering this CD cycle */
	chance: (id: number, mapData: KDMapDataType) => number,
	/** Actually perform the wander activity. True = go on cooldown*/
	doSpawn: (id: number, mapData: KDMapDataType, entity?: entity) => boolean,
}

let KDPersistentSpawnAIList: Record<string, PersistentSpawnAI> = {
	/** Default spawn AI: spawns the NPC at a random point on the map, if onmap, otherwise at the startposition with delayed spawn flag */
	Default: {
		cooldown: 50,
		filter: (id, mapData) => {
			let npc = KDGetPersistentNPC(id);
			return KinkyDungeonCurrentTick > (npc.nextSpawnTick || 0) && !npc.captured;
		},
		chance: (id, mapData) => {
			return mapData == KDMapData ? 0.4 : 0.1;
		},
		doSpawn: (id, mapData, entity) => {
			if (!entity && !mapData.Entities.some((ent) => {
				return ent.id == id;
			})) {
				let npc = KDGetPersistentNPC(id);
				let ent = KDAddEntity(npc.entity, false, false, true, mapData);

				if (mapData == KDMapData) {
					ent.runSpawnAI = true;
					entity = ent;
				} else {
					ent.x = KDMapData.StartPosition.x;
					ent.y = KDMapData.StartPosition.y;
					ent.runSpawnAI = true;
					return true;
				}
			}
			if (entity && entity.runSpawnAI) {
				let point = KinkyDungeonGetRandomEnemyPoint(
					true, false, undefined, undefined, 10
				);
				if (point) {
					KDMoveEntity(entity, point.x, point.y,
						false, false, false, false,
						true);
					entity.runSpawnAI = false;
					return true;
				} else {
					// Wait till next spawn cycle
					KDRemoveEntity(entity, false, false, true);
					return true;
				}
			}

			return false;
		},
	},
};

