const { StatusCodes } = require('http-status-codes')
const services = require("~/services");
const db = require("~/models");
const { Op } = require('sequelize');
const moment = require("moment");

// Create Discount Admin route 
export const getSalesReport = async (req, res) => {
    try {
        let { orderBy, orderByMethod, branchId, startDate, endDate, page, limit, productName, userName, transactionId } = req.query;
        const mapOrderBy = { createdAt: "Orders.createdAt", productQuantity: "CombinedQuery.quantity" };
        orderBy = mapOrderBy[orderBy] || "Orders.id";
        orderByMethod = orderByMethod || "ASC";
        branchId = branchId || "";
        productName = productName ? `%${productName}%` : "";
        userName = userName ? `%${userName}%` : "";
        transactionId = transactionId ? `%${transactionId}%` : "";
        startDate = startDate || "1970-01-01 00:00:00";
        endDate = endDate || "9999-12-31 23:59:59";
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const salesReportQuery = `
    SELECT "Orders".id, CombinedQuery."branchName" as branchName, "Orders"."createdAt", "Users"."userName", CombinedQuery.productName, CombinedQuery.price, CombinedQuery.quantity, CombinedQuery.price * CombinedQuery.quantity as total_price
    FROM (
      SELECT "OrderDetails".*, "StoreBranches"."branchName", "ProductVariants".name as productName, "ProductVariants".price as price, "StoreBranches".id as branchId
      FROM "OrderDetails"
      JOIN "Inventories" ON "OrderDetails"."inventoryId" = "Inventories".id
      JOIN "ProductVariants" ON "Inventories"."productVariantId" = "ProductVariants".id
      JOIN "StoreBranches" ON "Inventories"."storeBranchId" = "StoreBranches".id
    ) AS CombinedQuery
    JOIN "Orders" ON CombinedQuery."orderId" = "Orders".id
    JOIN "Users" ON "Orders"."userId" = "Users".id
    JOIN "OrderStatuses" ON "Orders"."orderStatusId" = "OrderStatuses".id
    WHERE "OrderStatuses".name IN ('Chờ xác nhận', 'Đã giao') 
    AND ${branchId ? `"CombinedQuery"."branchId" = :branchId` : "1 = 1"}
    AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
    AND ${productName ? `"CombinedQuery"."productName" LIKE :productName` : "1 = 1"}
    AND ${userName ? `"Users"."userName" LIKE :userName` : "1 = 1"}
    AND ${transactionId ? `"Orders"."id" LIKE :transactionId` : "1 = 1"}
    LIMIT :limit
    OFFSET :offset;`

        const countQuery = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT "OrderDetails".*, "StoreBranches"."branchName", "ProductVariants".name as productName, "StoreBranches".id as branchId
      FROM "OrderDetails"
      JOIN "Inventories" ON "OrderDetails"."inventoryId" = "Inventories".id
      JOIN "ProductVariants" ON "Inventories"."productVariantId" = "ProductVariants".id
      JOIN "StoreBranches" ON "Inventories"."storeBranchId" = "StoreBranches".id
    ) AS CombinedQuery
    JOIN "Orders" ON CombinedQuery."orderId" = "Orders".id
    JOIN "Users" ON "Orders"."userId" = "Users".id
    JOIN "OrderStatuses" ON "Orders"."orderStatusId" = "OrderStatuses".id
    WHERE "OrderStatuses"."name" IN ('Chờ xác nhận', 'Đã giao') 
    AND ${branchId ? `"CombinedQuery"."branchId" = :branchId"` : "1 = 1"}
    AND "Orders"."createdAt" BETWEEN :startDate AND :endDate
    AND ${productName ? `"CombinedQuery"."productName" LIKE :productName` : "1 = 1"}
    AND ${userName ? `"Users"."userName" LIKE :userName` : "1 = 1"}
    AND ${transactionId ? `"Orders"."id" LIKE :transactionId` : "1 = 1"}
    ;`
        const result = await db.sequelize.query(salesReportQuery, { replacements: { branchId, startDate, endDate, limit, offset, productName, userName, transactionId }, });
        const countResult = await db.sequelize.query(countQuery, { replacements: { branchId, startDate, endDate, productName, userName, transactionId }, });
        const totalItems = countResult[0][0].total
        const totalPages = Math.ceil(totalItems / limit);
        const data = { totalItems, totalPages, currentPage: page, items: result[0], };
        return res.status(200).send({ status: "Successfully find inventory", data: data, });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};