window.addEventListener('load', () => {
    $('#calculate').click(function(){
        document.getElementById('errorMsg').innerHTML = "";
        const inputBinary = document.getElementById('inputBinary').value;
        const inputBits = document.getElementById('inputBits').value;
        const inputSign = $("input[name='inputSign']:checked").val();
        var binaryList = inputBinary.split("");
        
        var truncate = [];
        var offBits = [];
        var roundUp = 0;
        var roundDown = 0;
        var ties = [];
        var carryUp = [];
        var carryDown = [];

        var isBinary = true;
        var isDone = false;
        var isEmpty = false;
        var isZero = false;     // checker for the last digit
        var numDot = 0;

        var firstNz = -1;   //first non zero index
        var lastNz = -1;    //last non zero index
        var dotIndex = -1;   //index of dot
        var sigNum = -1;     //number of significant

        var userBits = inputBits;
        var ctr1 = 0;


        refresh();
        emptyChecker();

        //PRE-OPERATION
        if(isDone === false){
            indexScanner();
            if(isBinary == true){
                //Number of Bits Chcecker
                if(inputBits <= sigNum && inputBits > 0){                  
                    //ACTUAL OPERATIONS
                    arTrunc();
                    arRup();
                    arRdown();
                    arTte();
                    isDone = true;
                } else err2();
            } 
        };

        document.getElementById('debug').innerHTML = sigNum;
        document.getElementById('offBits').innerHTML = offBits;

        //CHECKER FUNCTIONS
        //Empty Field Checker
        function emptyChecker(){
            if(inputBinary===""){   
                if(inputBits===""){
                    if(inputSign===undefined){
                        warnBinary();
                        warnBits();
                        warnSign();
                        err3();
                    } else{
                        warnBinary();
                        warnBits();
                        err3();
                    }
                } else{
                    warnBinary();
                    err3();
                }
            } else if(inputBits===""){
                if(inputSign===undefined){
                    warnBits();
                    warnSign();
                    err3();
                } else{
                    warnBits();
                    err3();
                }
            } else if(inputSign===undefined){
                warnSign();
                err3();
            };
        }

        //Index Scanner
        function indexScanner(){
            for(i=0; i<binaryList.length; i++){
                if(binaryList[i] === ".") numDot++;
                if(binaryList[i] !== "0" && binaryList[i] !== "1" && binaryList[i] !== ".") isBinary = false;
                if(binaryList[i] !== "0" && binaryList[i] !== "."){
                    if(firstNz === -1) firstNz=i;
                    lastNz = i;
                }
                else if(binaryList[i] === ".") dotIndex=i;
            };  if(numDot>1) isBinary = false;

            if(isBinary === true){
                if(dotIndex !== -1){
                    if(firstNz === -1 && lastNz === -1) sigNum = lastNz - firstNz;
                    else if(dotIndex<firstNz) sigNum = binaryList.length - firstNz;
                    else if(dotIndex>firstNz) sigNum = binaryList.length - 1 - firstNz;
                }
                else if(dotIndex === -1){
                    if(firstNz === -1 && lastNz === -1) sigNum = 0;
                    else sigNum = lastNz - firstNz + 1;
                }
                if(sigNum === 0) isBinary = false;
            }   if(isBinary === false) err1();
        };

        //ROUNDING OPERATIONS
        //Truncate
        function arTrunc(){
            for(i = 0; i < binaryList.length; i++){
                if(binaryList[i] !== undefined){
                    if(dotIndex !== -1 && ctr1 < userBits){    //if dot exists
                        //if(binaryList[i] === "." && i === 0) truncate = truncate + 0;
                        if(binaryList[i] === "." && firstNz < dotIndex) userBits++;
                        if(i<firstNz && firstNz > dotIndex && i===dotIndex){
                            truncate = truncate + 0;
                            truncate = truncate + binaryList[i];
                        };
                        if(i<firstNz && firstNz > dotIndex && i>dotIndex){
                            truncate = truncate + binaryList[i];
                        };
                        if(i>=firstNz){
                            truncate = truncate + binaryList[i];
                            ctr1++;
                        };
                    } else if(dotIndex === -1 && ctr1 < userBits){  //if dot doesn't exist
                        if(i>=firstNz){
                            truncate = truncate + binaryList[i];
                            ctr1++;
                        };
                    } else offBits = offBits + binaryList[i];
                } else err2();
            };
            if(isDone === false){
                if(inputSign == "negative"){
                    temp = "-" + truncate;
                    document.getElementById('truncate').innerHTML = temp;
                } else {
                    document.getElementById('truncate').innerHTML = truncate;
                }
            };
        };

        //Round Up
        function arRup(){

            var truncated = truncate.split('');
            var zeroIndex = -1;
            var carryIndex = -1;
            var carryMsg = "";

            if(inputSign == "negative"){
                document.getElementById('roundUp').innerHTML = temp;
                roundUp = truncate;
            } else {
                if(truncated[truncated.length - 1] == "0"){
                    truncated[truncated.length - 1] = "1";
                } else {
                    for(i = truncated.length - 1; i >= 0; i--){
                        if(truncated[i] == "0"){
                            zeroIndex = i;
                            break;
                        }
                    }
                }

                
                if(zeroIndex != -1){
                    for(i = zeroIndex; i < truncated.length; i++){
                        if(truncated[i] == "1"){
                            truncated[i] = "0";
                        }
                    }
                    truncated[zeroIndex] = "1";

                } else {
                    for(i = 0; i < truncated.length; i++){
                        if(truncated[i] == "1"){
                            carryIndex = i;
                            break;
                        }
                    }

                    if(carryIndex != -1){
                        carryUp = truncated.slice();
                        carryUp[carryIndex] = "10";
                        carryMsg = "With Carry: " + carryUp.join('');
                        $('#carryUp').text(carryMsg);
                    }
                }

                roundUp = truncated.join('');
                document.getElementById('roundUp').innerHTML = roundUp;
            }
        };

        //Round Down
        function arRdown(){
            truncated = truncate.split('');
            zeroIndex = -1;
            var carryIndex = -1;
            var carryMsg = ""

            if(inputSign == "positive"){
                if(truncated[truncated.length - 1] == "1"){
                    truncated[truncated.length - 1] = "0";
                }
                temp = truncated.join('');
                document.getElementById('roundDown').innerHTML = temp;
            } else {

                if(truncated[truncated.length - 1] == "0"){
                    truncated[truncated.length - 1] = "1";
                } else {
                    for(i = truncated.length - 1; i >= 0; i--){
                        if(truncated[i] == "0"){
                            zeroIndex = i;
                            break;
                        }
                    }
                }
                if(zeroIndex != -1){
                    for(i = zeroIndex; i < truncated.length; i++){
                        if(truncated[i] == "1"){
                            truncated[i] = "0";
                        }
                    }
                    truncated[zeroIndex] = "1";
                } else {
                    for(i = 0; i < truncated.length; i++){
                        if(truncated[i] == "1"){
                            carryIndex = i;
                            break;
                        }
                    }

                    if(carryIndex != -1){
                        carryDown = truncated.slice();
                        carryDown[carryIndex] = "10";
                        carryMsg = "With Carry: -" + carryDown.join('');
                        $('#carryDown').text(carryMsg);
                    }
                }
                roundDown = truncated.join('');
                temp = "-" + roundDown;
                document.getElementById('roundDown').innerHTML = temp;
            }
        };

        //Ties to Even
        function arTte(){
            var suffix = 0;
            var lastDigit = 0;
            var dig = 0;
            var sum = 0;
            var n = 2; // counter for suffix
            var z = "0";
            var msg = "";

            /// truncate first
            ties = "";
            dig = offBits.length;
            
            // get first digits of offbits
            for (i = 0; i <= dig; i++)
            {
                if (i == 0)
                    suffix = offBits[i];
            }
            // get last digit of ties
            lastDigit = truncate.slice(-1);
           
        // check if tie 
            if (suffix == 0)
            {
                ties = truncate; // truncate
            }
            else
            {
                for (i = 0; i < dig; i++){
                    sum = sum + parseInt(offBits[i]);
                }
                if (sum > 1){
                    if (inputSign == "positive"){
                        ties = roundUp; //roundUp since odd
                        if(carryUp != ""){
                            msg = "With Carry: " + carryUp.join('');
                            $('#carryTies').text(msg);
                        }
                    }
                    else {
                        ties = roundDown; // roundDown since odd (negative)
                        if(carryDown != ""){
                            msg = "With Carry: -" + carryDown.join('');
                            $('#carryTies').text(msg);
                        }
                    }
                }
                else { //tie 
                    if (lastDigit == 1)
                    {   
                        
                        if (inputSign == "positive"){
                            ties = roundUp; //roundUp since odd
                            if (carryUp != "") {
                                msg = "With Carry: " + carryUp.join('');
                                $('#carryTies').text(msg);
                            }
                        }
                        else {
                            ties = roundDown; // roundDown since odd (negative)
                            if (carryDown != ""){
                                msg = "With Carry: -" + carryDown.join('');
                                $('#carryTies').text(msg);
                            }
                        }
                    }
                    else{
                        ties = truncate; // truncates since even
                    }
                }
            }
            
            if(inputSign === "negative" && ties != "0"){ties = "-" + ties;}
            document.getElementById('ties').innerHTML = ties;
        };

        //ERROR MESSAGES
        //Error 1: Input is not a binary
        function err1(){
            warnBinary();
            document.getElementById('errorMsg').innerHTML = "INVALID BINARY";
            isDone = true;
        };

        //Error 2: Invalid number of bits
        function err2(){
            warnBits();
            document.getElementById('errorMsg').innerHTML = "INVALID # OF BITS";
            isDone = true;
        };

        //Error 3: Empty binary
        function err3(){
            document.getElementById('errorMsg').innerHTML = "ALL FIELDS ARE REQUIRED";
            isDone = true;
            isEmpty = true;
        };

        //CSS FUNCTIONS
        //Borderize Input Binary
        function warnBinary(){
            $('#inputBinary').addClass('border border-danger');
        };

        //Borderize Input Bits
        function warnBits(){
            $('#inputBits').addClass('border border-danger');
        };

        //Borderize Input Sign
        function warnSign(){
            $('#inputSignBox').addClass('border border-danger');
        };

        //Refresh Function
        function refresh(){
            $('#inputBinary').removeClass('border-danger');
            $('#inputBits').removeClass('border-danger');
            $('#inputSignBox').removeClass('border border-danger');
            $('#carryUp').text("");
            $('#carryDown').text("");
            $('#carryTies').text("");
            document.getElementById('truncate').innerHTML = 0;
            document.getElementById('roundUp').innerHTML = 0;
            document.getElementById('roundDown').innerHTML = 0;
            document.getElementById('ties').innerHTML = 0;
        }
    });
});