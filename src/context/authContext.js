import React, { useContext, useState, useEffect} from "react"
import  { auth, db } from "../server/firebase"
import 'firebase/firestore';
import { storage } from "../server/firebase";
import firebase from 'firebase/app'





//Når nye komponenter blir tatt frem lytter de til context objektet laget her
const AuthContext = React.createContext()

//Gir tilgang til verdiene i andre komponenter
export function useAuth() {
  return useContext(AuthContext)
}

//1. Dette er informasjon som vi ønsker at skal få tilgang til context
//2. gjeldeneBruker håndtere alle bruker attributter. f.eks. info ved registrering og state til ulike komponenter

export function AuthProvider({ children }) {
  const [gjeldeneBruker, setGjeldeneBruker] = useState()
  const [fornavnDisplay, setFornavnDisplay] = useState()
  const [etternavnDisplay, setEtternavnDisplay] = useState()
  const [nominerbarDisplay, setNominerbarDisplay] = useState()
  const [loading, setLoading] = useState(true)
  const [errors, setError] = useState("")
  

function stemBruker(id, valueChange) {
  return db.collection("BrukerInfo")
  .doc(id)
  .update({
    antallStemmer: firebase.firestore.FieldValue.increment(valueChange)
  })
}


function brukerHarStemt(id, booleanParam) {
  return db.collection("BrukerInfo")
  .doc(id)
  .update({
    harStemt: booleanParam
  })
}

function votedOn(id, stemtId) {
  return db.collection("BrukerInfo")
  .doc(id)
  .update({
    votedOn: stemtId
  })
}

 
async function nominerBruker(id, fornavn, etternavn){
  await db.collection("BrukerInfo")
  .doc(id)
  .update({
    Nominert: true,
    Nominerbar: false
  })
  .then(() => {
    console.log(fornavn + " " + etternavn + " er nominert")
  })
  .catch((error) => {
    console.error("Kunne ikke nominere")
  })
}

//Henter inn informasjon fra registering og legger det inn i firebase
  function registrer(email, password, fornavn, etternavn, nominerbar) {
    auth.createUserWithEmailAndPassword(email, password).then( cred => {
      return db.collection('BrukerInfo').doc(cred.user.uid).set({
        Email: email, 
        Fornavn: fornavn,
        Etternavn: etternavn,
        Nominerbar: nominerbar,
        beskrivelse: null,
        id: cred.user.uid,
        harStemt: false,
        votedOn:"",
        antallStemmer: 0,
        Nominert: false
      })  
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if(errorCode == "auth/email-already-in-use"){
        setError(errorMessage)
    } else {
      setError(errorMessage);
    }
    console.log(error);
  });
  setError("")
  }


  function logginn(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
    
  }

  function loggut() {
    auth.signOut();
  }

  function glemtPassord(email) {
    return auth.sendPasswordResetEmail(email);
 }

 function uploadBilde(picFile) {
  return storage.ref('brukere/' + gjeldeneBruker.uid + '/profile.jpg').put(picFile);
 }

 function oppdaterMail(email) {
  return gjeldeneBruker.updateEmail(email)
}

function oppdaterPassord(password) {
  return gjeldeneBruker.updatePassword(password)
}

function oppdaterFNavn (fornavn)  {
  return db.collection('BrukerInfo').doc(gjeldeneBruker.uid).update({
    Fornavn: fornavn
  })
}
function oppdaterENavn (etternavn)  {
  return db.collection('BrukerInfo').doc(gjeldeneBruker.uid).update({
    Etternavn: etternavn
  })
}

function oppdaterNom(nominerbar) {
  return db.collection('BrukerInfo').doc(gjeldeneBruker.uid).update({
    Nominerbar: nominerbar
  })
} 

function oppdaterBeskrivelse(beskrivelse) {
  return db.collection('BrukerInfo').doc(gjeldeneBruker.uid).update({
    beskrivelse: beskrivelse
  })
}

function sjekkEpost() {
  setTimeout(() => {
    if(registrer() === false){
      setError("Feil")
    }
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
      setError("Aktiverings epost er sendt til din epost")// Email sent.
    }).catch(function(err) {
  
      
    });      
    console.log(user.sendEmailVerification());

  }, 2000);
}

  
  //useEffect: Når noe skjer vil vi at en bivirkning skal skje
  //setTimeout setter en delay før den skal displaye fornavn og etternavn
  //3. Unsubscribe gjør slik at etter eventen har skjedd, stopper serveren å lytte til den
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setGjeldeneBruker(user)
      if(user) {
        setTimeout(() => {
        db.collection("BrukerInfo").doc(user.uid).onSnapshot(function (doc){
          const firstName = doc.data().Fornavn;
          const lastName = doc.data().Etternavn;
          const nominert = doc.data().Nominerbar;
          setFornavnDisplay(firstName);
          setEtternavnDisplay(lastName);
          setNominerbarDisplay(nominert)
          /*console.log(firstName, lastName)*/
       });
      }, 500);
      }
      setLoading(false)
      return unsubscribe
    })

    
  }, [])

  //Ulike verdier man gir Provider tilgang til å lytte etter
  const value = {
    gjeldeneBruker,
    fornavnDisplay,
    etternavnDisplay,
    nominerbarDisplay,
    errors,
    registrer,
    logginn,
    loggut,
    glemtPassord,
    uploadBilde,
    oppdaterPassord,
    oppdaterMail,
    oppdaterFNavn,
    oppdaterENavn,
    oppdaterNom,
    oppdaterBeskrivelse,
    nominerBruker,
    stemBruker,
    brukerHarStemt,
    sjekkEpost,
    votedOn
  }

  return (
      //1. Setter inn all data i Provider som trenger tilgang til informasjon i context
      //2. Alt på innsiden av Provider wrapperen har tilgang til denne informasjonen
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}