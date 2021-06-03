import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';



function GlemtPassord() {
   const emailRef = useRef();
   const { glemtPassord } = useAuth();
   const [error, setError] = useState("");
   const [message, setMessage] = useState("");
   const [loading, setLoading] = useState(false);

   async function handleSubmit(event) {
      event.preventDefault()

      try {
        setMessage('');
         setError('');
         setLoading(true);
         await glemtPassord(emailRef.current.value);
         setMessage("Instrukser for nytt passord er sendt på mail!");
      } catch {
         setError('Feil ved bytting av passord');
      }

      setLoading(false);
   }


   return (
    <div className="App">
        <div class="row">
            <div className="col s12 offset-m4 m4 card-panel glemtPassordPanel">
                <h2>Glemt Passord</h2>
                {error && <p>{error}</p>}
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit} className="col s12">
                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">mail_outline</i>
                            <input type="email" placeholder="Email" ref={emailRef} className="validate"/>
                        </div>
                    </div>
                    <button disabled={loading} type="submit" className="btn waves-effect waves-light right">Send Mail</button>
                </form>
                <p className="">Tilbake? <Link to="/Logginn">Logg Inn</Link></p>
            </div>
        </div>
    </div>
   );
}

export default GlemtPassord;