import React, { Fragment } from 'react'

const data = [
  {question: `Où puis-je acheter un MemoProut Pad ?`, answer: `Pour le moment il n'est pas possible d'acheter de MemoProut Pad.`},
  {question: `Comment puis-je fabriquer mon propre MemoProut Pad ?`, answer: <span>Vous trouverez l'ensemble des sources sur notre <a href="https://github.com/kaelhem/memoprout/tree/master/make" target="_blank" rel="noopener noreferrer">dépôt GitHub</a>. La documention est toutefois en cours de réalisation. N'hésitez pas utiliser le formulaire de contact un peu plus bas pour en savoir plus !</span>},
  {question: `C'est quoi ce nom pourri ?`, answer: `Quoi ? Non, il est génial ce nom !`},
  {question: `En vrai, il sert à quoi ce MemoProut Pad ?`, answer: `MemoProut Pad est l'objet indispensable pour lutter contre l'ennui et l'alzheimer. Grâce au MemoProut Pad vous pourrez améliorer votre capacité de mémorisation tout en stimulant votre sens de l'humour !`},
  {question: `Je peux mettre mes propres sons dessus ?`, answer: <span>Oui, il y a même une <a href="https://github.com/kaelhem/memoprout/tree/master/contrib" target="_blank" rel="noopener noreferrer">documentation</a> disponible sur le dépôt Github pour vous expliquer comment faire.</span>},
  {question: `J'ai un problème avec mon Memoprout Pad, que faire ?`, answer: <span>Si le problème rencontré n'est pas répertorié dans la <a href="https://github.com/kaelhem/memoprout/issues" target="_blank" rel="noopener noreferrer">liste des bugs</a>, vous pouvez l'ajouter.</span>},
  {question: `Y aura-t-il des mises-à-jour ?`, answer: <span>Comment le savoir ? En tout cas il y a un outil en cours de développement pour facilement mettre à jour votre MemoProut Pad: <a href="https://memoprout-pad-connect.firebaseapp.com/" target="_blank" rel="noopener noreferrer">le MemoProut-Connect</a>.</span>}
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
