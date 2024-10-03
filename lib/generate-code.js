export const GenereteCode=()=>{
    const code=Math.floor(Math.random()*1000000)
    const code_string=JSON.stringify(code)

    return {code:code_string}
}

