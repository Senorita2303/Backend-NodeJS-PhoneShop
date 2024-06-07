const db = require("~/models");

export const createSpecification = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { specName } = data;
            const specification = await db.Specification.create({
                specName: specName,
            })
            resolve({
                success: true,
                specification: specification
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllSpecifications = () =>
    new Promise(async (resolve, reject) => {
        try {
            const specifications = await db.Specification.findAll()
            resolve({
                success: true,
                specifications: specifications
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateSpecification = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let specificationData = {};
            specificationData.errMessage = null;
            const id = data.params.id;
            const body = data.body;
            let specification = await db.Specification.findOne({
                where: {
                    id: id,
                },
            });

            if (!specification) {
                specificationData.errMessage = "Specification not found"
            }

            const response = await db.Specification.update(body, {
                where: {
                    id: id,
                },
            });
            specificationData.success = true;
            specificationData.specification = response;
            resolve(specificationData);
        } catch (error) {
            reject(error);
        }
    });

export const deleteSpecification = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const id = data.id;
            const response = await db.Specification.destroy({
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