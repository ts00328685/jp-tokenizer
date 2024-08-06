import MeCab from 'mecab-async';
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
const mecab = new MeCab();
const app = express();
dotenv.config();
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

app.post('/gpt',  (req, res) => {
    console.log(req.body);
    if (!req.body || !req.body.query) {
        res.send({
            answer: 'Invalid query!'
        });
        return;
    }
    if (!req.body || req.body.key != process.env.GPT_API_ENDPOINT_KEY) {
        res.send({
            answer: 'Invalid key!'
        });
        return;
    }
    axios.post('https://api.openai.com/v1/chat/completions',
        {
            "model": "gpt-4",
            "messages": [{"role": "user", "content": req.body.query}],
            "temperature": 0.7
        },
        {
            headers: {
                'Authorization': 'Bearer ' + process.env.GPT_API_KEY,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
        console.log('response', response)
        res.send({
            answer: response.data.choices[0].message.content
        });
    }).catch((error) => {
        console.log(error)
        res.send({
            answer: 'Network issues, please try later!'
        });
    });
});

app.post('/gpt-custom',  (req, res) => {
    if (!req.body || !req.header('Authorization')) {
        res.send({
            answer: 'Invalid request!'
        });
        return;
    }
    axios.post('https://api.openai.com/v1/chat/completions',
        req.body,
        {
            headers: {
                'Authorization': req.header('Authorization'),
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            for (const header of response.headers) {
                res.setHeader(header[0], header[1]);
            }
            res.send(response.data);
        }).catch((error) => {
            res.send(error);
        });
});

app.listen(80, () => {
    console.log('Tokenizer app is listening on port 3000.')
});
