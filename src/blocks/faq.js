import React, { Fragment } from 'react'

const data = [
  {question: `Où puis-je acheter un MemoProut Pad ?`, answer: `Pour le moment il n'est pas possible d'acheter MemoProut Pad.`},
  {question: `Où trouver les plans de construction de MemoProut Pad ?`, answer: <span>Sur notre <a href="https://github.com/kaelhem/memoprout">dépôt GitHub</a>.</span>},
  {question: `C'est quoi ce nom pourri ?`, answer: `Quoi ? Non, il est génial ce nom !`},
  {question: `En vrai, il sert à quoi ce MemoProut Pad ?`, answer: `MemoProut Pad est l'objet indispensable pour lutter contre l'ennui et l'alzheimer. Grâce au MemoProut Pad vous pourrez améliorer votre capacité de mémorisation tout en stimulant votre sens de l'humour !`},
  {question: `Je peux mettre mes propres sons dessus ?`, answer: `Oui, il y a même un exemple disponible sur le dépôt Github.`},
  {question: `J'ai un problème avec mon Memoprout Pad, que faire ?`, answer: <span>Si le problème rencontré n'est pas répertorié dans la <a href="https://github.com/kaelhem/memoprout/issues">liste des bugs</a>, vous pouvez l'ajouter.</span>}
]

const FAQ = () => (
  <Fragment>
    <h2>FAQ</h2>
    <p>Questions fréquentes et réponses foireuses.</p>
    {
      data.map(({question, answer}, index) => (
        <div key={'q-' + index} className="faq-entry">
          <div className="faq-question">{ question }</div>
          <div className="faq-answer">{ answer }</div>
        </div>
      ))
    }
  </Fragment>
)

export default FAQ
