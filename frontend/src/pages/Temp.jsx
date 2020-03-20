import React from 'react'
import app from '../firebase';

export default function Temp() {
    return (
        <div>
            <h1>This page is for testing Authentication</h1>
            <button onClick={() => app.auth().signOut()}>Sign out</button>
        </div>
    )
}
