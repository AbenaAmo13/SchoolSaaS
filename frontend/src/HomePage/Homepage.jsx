import React, { useState } from "react";
import { useAuth } from "../Providers/AuthenticationProvider";

export default function Homepage(){
    const {user, accessToken, refreshToken, school} = useAuth()
    return(
        <div>
            <h3>Welcome </h3>

        </div>
    )
}