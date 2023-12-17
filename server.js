import MeCab from 'mecab-async';
import express from 'express';
const mecab = new MeCab();
const app = express();
app.use(express.json());
app.post('/tokenizer', (req, res) => {
    console.log(req.body)
    mecab.parse(req.body.sentence, function(err, result) {
        if (err) {
            res.send({ error: 'error tokenizing' });
            return;
        }
        console.log(result)
        res.send(result);
    });
});

app.listen(3000, () => {
    console.log('Tokenizer app is listening on port 3000.')
});