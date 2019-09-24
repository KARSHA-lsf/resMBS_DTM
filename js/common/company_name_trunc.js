function company_name_trunctated (word_length,company_name){
    var final_word ="";

    if(company_name.length>word_length){
        // remove punctuations 
        company_name = company_name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        if(company_name.length>word_length){
            // split to words and shortner
            var company_name_words = company_name.split(" ")
            var new_company_name = ""
            company_name_words.forEach(word => {
                new_company_name = new_company_name+" "+company_word_shortFormats(word)
            });

            if(new_company_name.length>word_length){
                final_word = new_company_name.substring(0,word_length);
                
            }else{
                final_word = new_company_name
            }
            

            
        }else{
            final_word = company_name
        }
        

    }else{
        final_word = company_name
    }

    return final_word
}

function company_word_shortFormats(word) {
    var name_array = [
        {
            word: "CORPORATION",
            short_word: "CORP"
        },
        {
            word: "MORTGAGE",
            short_word: "MORT."
        },
        {
            word: "RECEIVABLES",
            short_word: "RECE."
        },
        {
            word: "NETWORK",
            short_word: "NET."
        },
        {
            word: "SECURITIES",
            short_word: "SECUR."
        },
        {
            word: "SERVICING",
            short_word: "SERV."
        },
        {
            word: "ACCEPTANCE",
            short_word: "ACCEP."
        },
        {
            word: "COMPANY",
            short_word: "COMP."
        }


        

        

        

        
    ]
    return search(word, name_array);
   

}

function search(nameKey, myArray){
    
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].word === nameKey) {
            return myArray[i].short_word;
        }else{
            return nameKey;
        }
    }
}

