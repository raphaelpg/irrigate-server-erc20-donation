import { Request, Response } from 'express';
import transactionService from '../services/transacation.services';

const getTxs = async (req: Request, res: Response) => {
	try {
		let txs = await transactionService.serviceGetTx();
		return res.status(200).json({ status: 200, data: txs, msg: "Txs retrieved successfully" });
	} catch (e) {
		return res.status(400).json({ status: 400, msg: e.message });
	};
};

const addTx = async (req: Request, res: Response) => {
	let query = req.body;
	try {
		await transactionService.serviceAddTx(query, "pending");
		return res.status(201).json({ status: 201, msg: "Tx added successfully" });
	} catch (e) {
		return res.status(400).json({ status: 400, msg: e.message });
	};
};

const deleteTx = async (req: Request, res: Response) => {
	let query = req.body;
	try {
		await transactionService.serviceDeleteTx(query.name);
		return res.status(200).json({ status: 200, msg: "Tx deleted" });
	} catch (e) {
		return res.status(400).json({ status: 400, msg: e.message });
	};
};

const updateTx = async (req: Request, res: Response) => {
	let query = req.body;
	// let {status, ...rest} = query;
	try {
		await transactionService.serviceUpdateTx({ "donorAddress": query.donorAddress, "amount": query.amount }, query);
		return res.status(200).json({ status: 200, msg: "Tx updated" });
	} catch (e) {
		return res.status(400).json({ status: 400, msg: e.message });
	};
};

const give = async (req: Request, res: Response) => {
	let query = req.body;
	try {
		await transactionService.serviceProcessDonation(query);
		return res.status(200).json({ status: 200, msg: "Donation sent" });
	} catch (e) {
		return res.status(400).json({ status: 400, msg: e.message });
	};
};

export default {
	getTxs,
	addTx,
	deleteTx,
	updateTx,
	give
};