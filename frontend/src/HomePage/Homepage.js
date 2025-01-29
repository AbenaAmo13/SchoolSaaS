import React, { useState } from "react";
import { useAuth } from "../Providers/AuthenticationProvider";

export default function Homepage(){
    const {user, accessToken, refreshToken, school} = useAuth()
    console.log(`The user is ${user}`)
    return(
        <div>
            <h3>Welcome </h3>

        </div>
    )
}