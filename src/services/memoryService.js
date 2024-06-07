const db = require("~/models");

export const createMemory = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { ram, rom, chipset } = data;
            const memory = await db.Memory.create({
                ram: ram,
                rom: rom,
                chipset: chipset
            })
            resolve({
                success: true,
                memory: memory
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllMemories = () =>
    new Promise(async (resolve, reject) => {
        try {
            const memories = await db.Memory.findAll()
            resolve({
                success: true,
                memories: memories
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateMemory = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let memoryData = {};
            memoryData.errMessage = null;
            memoryData.memory = {};
            memoryData.success = false;
            const id = data.params.id;
            const body = data.body;
            let memory = await db.Memory.findOne({
                where: {
                    id: id,
                },
                raw: false,
            });

            if (!memory) {
                memoryData.errMessage = "Memory not found"
            } else {
                memory.ram = body.ram;
                memory.rom = body.rom;
                memory.chipset = body.chipset;
                await memory.save();
                memoryData.success = true;
                memoryData.memory = response;
            }
            resolve(memoryData);
        } catch (error) {
            reject(error);
        }
    });

export const deleteMemory = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const id = data.id;
            const response = await db.Memory.destroy({
                where: {
                    id: id
                },
            });
            resolve({
                success: true,
            });
        } catch (error) {
            reject(error);
        }
    });