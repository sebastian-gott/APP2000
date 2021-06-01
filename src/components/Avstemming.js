import React, { useState, useEffect, useRef } from 'react'
import  { db } from "../server/firebase"
import { useAuth } from "../context/authContext";

export default function Avstemming() {

    const [brukere, setBruker] = useState("")
    const [harStemt, setharStemt] = useState();
    const [voteId, setVoteId] = useState()
    const { stemBruker, brukerHarStemt, gjeldeneBruker, votedOn } = useAuth()
    const fornavnRef = useRef()
    const etternavnRef = useRef()
    const beskrivelseRef = useRef()


    useEffect(() => {
        db.collection('BrukerInfo')
        .where("Nominert", "==", true)
        .get()
        .then(snapshot => {
          const documents = snapshot.docs.map(doc => doc.data())
          setBruker(documents);
        })
    }, [])

    useEffect(() => {
        const unsub = db.collection('BrukerInfo').doc(gjeldeneBruker.uid)
        .onSnapshot(function (doc){
            const stemmeSjekk = doc.data().harStemt;
            const votedId = doc.data().votedOn
            setVoteId(votedId)
            //console.log(stemmeSjekk)
            if(stemmeSjekk === true){
                setharStemt(stemmeSjekk)
            }
            return unsub
        })
        
        
    }, [])

    

    async function handleSubmit(id) {
        const brukerFinner = brukere.find(bruker => bruker.id === id)
        await stemBruker(brukerFinner.id, 1);
        //console.log(gjeldeneBruker)
        await brukerHarStemt(gjeldeneBruker.uid, true)
        await votedOn(gjeldeneBruker.uid, brukerFinner.id)
        
    }

   async function handleRegret() {
        await stemBruker(voteId, -1)
        await brukerHarStemt(gjeldeneBruker.uid, false)
        await votedOn(gjeldeneBruker.uid, "")
        window.location.reload()
        
    }

    return ( 
    <div className="App">
        <div className="row width-margin">
        <h3>Stem på en kandidat</h3>
        <p>Trykk på "stem" for å stemme på en kandidat. Kandidaten vil da få en stemme</p>
        { brukere && brukere.map(bruker => {
        return(
            <div className="col width-margin m6 card-panel nominerKort" key= {bruker.id}>
                <p ref={ fornavnRef } ><strong>{ bruker.Fornavn }</strong> </p>
                <p ref={ etternavnRef } ><strong>{ bruker.Etternavn }</strong>:</p>
                <p ref={ beskrivelseRef } > { bruker.beskrivelse } </p>
                {  !harStemt && <button className="float-right btn waves-effect waves-light" onClick= { () => handleSubmit(bruker.id) } >Stem</button>}
                {   harStemt && <button className="float-right btn waves-effect waves-light" onClick= { () => handleSubmit(bruker.id) } disabled >Stem</button>}
            </div>
        )}
        )
        }
        { harStemt && <button className="float-right btn waves-effect waves-light" onClick= {() => handleRegret()}>Angre</button>}
        </div>
    </div>
     );
}
 
