import axios from 'axios';

export const Micro=async(name:string,email:string,password:string,userType:string)=>{
    console.log("microservice called")
   
    const response2=await axios.post('http://localhost:3000/api/microservice',
        {
        name,
        email,
        password,
        userType
        },
        {
        headers:{
            "Content-Type":"application/json"
        }
    }
    )
}

