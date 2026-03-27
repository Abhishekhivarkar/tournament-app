import { updateWithdrawStatusService } from "../services/tournament.service.js";
import {
  requestWithdrawService,
  getMyTransactionsService,
} from "../services/transaction.service.js";

export const requestWithdraw = async (req, res, next) => {
  try {
    await requestWithdrawService(req.user._id, req.body.amount);

    res.status(200).json({
      success: true,
      message: "Withdrawal request submitted",
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTransactions = async (req, res, next) => {
  try {
    const result = await getMyTransactionsService(req.user._id, req.query);

    res.status(200).json({
      success: true,
      page: result.page,
      limit: result.limit,
      totalTransactions: result.total,
      totalPages: result.totalPages,
      data: result.transactions,
    });
  } catch (error) {
    console.error("GET MY TRANSACTIONS ERROR:", error);
    next(error);
  }
};


export const updateWithdrawStatus = async (req, res, next) => {

  try {

    const { id } = req.params
    const { status } = req.body

    const transaction = await updateWithdrawStatusService(id, status)

    res.status(200).json({
      success: true,
      data: transaction
    })

  } catch (error) {
    next(error)
  }

}