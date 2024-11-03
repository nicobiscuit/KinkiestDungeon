interface PersistentWanderAI {
	/** Number of turns between wanders */
	cooldown: number,
	/** Whether or not NPC is willing to wander */
	filter: (id: number, mapData: KDMapDataType) => boolean,
	/** Chance of wandering this CD cycle */
	chance: (id: number, mapData: KDMapDataType) => number,
	/** Actually perform the wander activity */
	doSpawn: (id: number, mapData: KDMapDataType) => boolean,
}

let KDPersistentWanderAIList: Record<string, PersistentWanderAI> = {

};