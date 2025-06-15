import React, { useState } from "react";
import { useAuth } from "../Providers/AuthenticationProvider";

export default function Homepage(){
    const {user, accessToken, refreshToken, school} = useAuth()
    console.log(user)
    return(
        <div>
            <h3>Hello {user.username} </h3>

        </div>
    )
}