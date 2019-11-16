import React, { Fragment } from 'react'

const Contact = () => (
  <Fragment>
    <h2>Contactez-nous</h2>
    <p>Si vous avez une question, une remarque ou autre, vous pouvez nous le dire, on prendra le temps de vous répondre.</p>
    <form name="contact" method="post">
      <input type="hidden" name="form-name" value="contact" />
      <p>
        <label><span>Nom :</span><input type="text" name="name"/></label>
      </p>
      <p>
        <label><span>Email :</span><input type="email" name="email"/></label>
      </p>
      <p>
        <label><span>Message :</span><textarea name="message"></textarea></label>
      </p>
      <p style={{ textAlign: 'right', marginRight: 1 }}>
        <button type="submit">Envoyer</button>
      </p>
    </form>
  </Fragment>
)

export default Contact
