const db = require("~/models");

export const createColor = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { name, code } = data;
            const color = await db.Color.create({
                name: name,
                code: code
            })
            resolve({
                success: true,
                color: color
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllColors = () =>
    new Promise(async (resolve, reject) => {
        try {
            const colors = await db.Color.findAll()
            resolve({
                success: true,
                colors: colors
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateColor = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let colorData = {};
            colorData.errMessage = null;
            colorData.color = {};
            colorData.success = false;
            const id = data.params.id;
            const body = data.body;
            let color = await db.Color.findOne({
                where: {
                    id: id,
                },
                raw: false
            });

            if (!color) {
                colorData.errMessage = "Color not found"
            } else {
                color.name = body.name;
                color.code = body.code;
                await color.save();
                colorData.success = true;
                colorData.color = response;
            }
            resolve(colorData);
        } catch (error) {
            reject(error);
        }
    });

export const deleteColor = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const id = data.id;
            const response = await db.Color.destroy({
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