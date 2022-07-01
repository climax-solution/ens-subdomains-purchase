var express = require('express');
const { checkReviewSign } = require('../../helper');
const Review = require('../../models/review');
var router = express.Router();

router.post('/get-list', async function(req, res) {
    try {
        const { address } = req.body;
        const list = await Review.find({ to: address });
        res.status(200).json({ list });
    } catch(err) {
        res.status(400).json({ success: false });
    }
});

router.post('/leave-review', async function(req, res) {
    try {
        const { star, from, to, subdomain, comment, signature } = req.body;
        const isVaild = await checkReviewSign(star, from, to , subdomain, comment, signature);
        if (!isVaild) throw Error("Not valid signature");
        const review = new Review({
            star,
            from,
            to,
            subdomain,
            comment
        });
        await review.save();
        res.status(200).json({
            success: true
        });
    } catch(err) {
        console.log(err);
        res.status(400).json({
            message: err?.message
        })
    }
})
module.exports = router;