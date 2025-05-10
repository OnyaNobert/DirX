var whites=0
        var blacks=0
        var size=4
        var banned=0
        var locked=0
        var cccc=document.querySelector('canvas')
        cccc.height=(size+1)*100
        cccc.width=(size+1)*100
        var colorscheme=['#769656','#eeeed2']
        var can=cccc.getContext('2d')
        var a=false; var b=true
        var turn=0
        var aut1=[]; var aut2=[]
        var dirs=['?','?']
        var dir
        var virtarray=[]
        var t
        var score=0
        
        var array=[['black', 'black', 'black', 'black', 'black'],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['white', 'white', 'white', 'white', 'white']]
            
            function count(){
                for(var i=0; i<array.length; i++){
                    for(var j=0; j<array.length; j++){
                        if(array[i][j]=='white'){
                            whites++
                        }
                        if(array[i][j]=='black'){
                            blacks++
                        }
                    }
                }
                if(whites==0){alert('BLACK WINS')}
                if(blacks==0){alert('WHITE WINS')}
                whites=0
                blacks=0
            }
        function draw(){
            if(dirs[turn]=='?'){
                dirs[turn]=prompt('choose direction + or x')
            }
            document.getElementById('white').innerHTML=dirs[0]
            document.getElementById('black').innerHTML=dirs[1]
            dir=dirs[turn]
            var col=0
            for(var j=0; j<size+1; j++){
            for(var i=0; i<size+1; i++){
                if((i+j)%2==0){col=1}
                else{col=0}
                can.fillStyle=colorscheme[col]
                can.fillRect(i*100,j*100,100,100)
                if(array[j][i]=='white'){
                    can.beginPath()
                    can.arc(50+i*100,50+j*100,40,0,Math.PI*2,false)
                    can.fillStyle='white'
                    can.fill()
                }
                if(array[j][i]=='black'){
                    can.beginPath()
                    can.arc(50+i*100,50+j*100,40,0,Math.PI*2,false)
                    can.fillStyle='black'
                    can.fill()
                }
                if(col==0){col=1}
                    else{col=0}
            }}
            count()
            //aimove()
        }
        
        function legalise(){
            var col=Math.abs(aut1[0]-aut2[0]); var row=Math.abs(aut1[1]-aut2[1])
            var selfcapture=array[aut1[0]][aut1[1]]!=array[aut2[0]][aut2[1]]
            if(row+col==2 && row==1 && col==1 && dir=='x' && selfcapture){
                return true
            }
            else if(row+col==1 && dir=='+' && selfcapture){
                return true
            }
            else{alert('illegal move'); aut1=[]; aut2=[]; draw(); locked=0
             return false}
        }
        document.addEventListener('keydown',event=>{
            if(event.key=='s'){
                aimove()
            }
        })
        canvas.addEventListener('click',event=>{
             const rect = canvas.getBoundingClientRect()
            var m=Math.floor((event.clientY-rect.top)/100); var n=Math.floor((event.clientX-rect.left)/100)
            can.fillStyle='rgba(255,0,0,0.5)'
            can.fillRect(n*100,m*100,100,100)
            if(array[m][n]=='black' && turn==1 && locked==0){
                aut1=[m,n];
            }
            else if(array[m][n]=='white' && turn==0 && locked==0){
                aut1=[m,n]
            }
            else{banned=1}
            if(locked==1){
                aut2=[m,n]
                if(legalise()){
                    array[aut1[0]][aut1[1]]=''
                    if(turn==0){array[aut2[0]][aut2[1]]='white'}
                        else{array[aut2[0]][aut2[1]]='black'}

                    aut1=[]; aut2=[];
                     if(dirs[turn]=='+'){dirs[turn]='x'}
                        else{dirs[turn]='+'}
                     if(turn==0){turn=1}
                    else{turn=0};
                    locked=0
                    draw()
                }
            }
            else if(banned==0){locked=1}
            if(banned==1){banned=0; draw()}
        })
        function checkvalidity(board,direction,origin,destination){
             var col=Math.abs(origin[0]-destination[0]); var row=Math.abs(origin[1]-destination[1])
            var selfcapture=board[origin[0]][origin[1]]!=board[destination[0]][destination[1]]
            if(row+col==2 && row==1 && col==1 && direction=='x' && selfcapture){
                return true
            }
            else if(row+col==1 && direction=='+' && selfcapture){
                return true
            }
            else {return false}
             }
        function permuteMoves(cordinates,direction,board){
            movelist=[]
            validatedcandidates=[]
            if(direction=='x'){
                movelist=[[cordinates[0]+1,cordinates[1]+1],[cordinates[0]-1,cordinates[1]+1],
                [cordinates[0]-1,cordinates[1]-1],[cordinates[0]+1,cordinates[1]-1]]
            }
             if(direction=='+'){
                movelist=[[cordinates[0]+1,cordinates[1]],[cordinates[0]-1,cordinates[1]],
                [cordinates[0],cordinates[1]-1],[cordinates[0],cordinates[1]+1]]
            }
            for(var i=0; i<movelist.length; i++){
                if(movelist[i][0]>=0 && movelist[i][0]<=size && movelist[i][1]>=0 && movelist[i][1]<=size
                     && checkvalidity(board,direction,[cordinates[0],cordinates[1]],[movelist[i][0],movelist[i][1]])){
                    validatedcandidates[validatedcandidates.length]=movelist[i]
                }
            }
            return validatedcandidates
        }   
        function findallmoves(board, turntoplay, direction) {
        let movelist = [];

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === turntoplay) {
                const from = [i, j];
                const possibleMoves = permuteMoves(from, direction, board);

                    for (let k = 0; k < possibleMoves.length; k++) {
                    const to = [possibleMoves[k][0], possibleMoves[k][1]];
                    const move = [from, to];
                    movelist.push(move);
                    }
                }
            }
        }
        return movelist;
        }
        function copyboard(board){
            return board.map(row => row.slice());
        }
        function evaluate(board){
            var score=0
            for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 'black') {
                score += i + 1; // Reward black for being closer to the enemy
            } else if (board[i][j] === 'white') {
                score -= (size - i) + 1; // Penalize white for being closer to black
            }
        }
    }
            return score
        }
        function moveboard(board,turntoplay,direction,movetoplay){
            var newboard=copyboard(board)
            var from=movetoplay[0]
            var to=movetoplay[1]
            if(checkvalidity(board,direction,from,to)){
                
                newboard[from[0]][from[1]]='';
                newboard[to[0]][to[1]]=turntoplay
            }
            return newboard
        }
        console.log(evaluate(array))
function minimax(board, depth, isMaximizingPlayer, blackDir, whiteDir, alpha, beta) {
    // If we've reached the maximum depth or the game is over, return the evaluated score
    if (depth === 0 || gameOver(board)) {
        return evaluate(board); // Use the evaluate function here
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        let possibleMoves = findallmoves(board, 'black', blackDir);
        let newBlackDir = (blackDir === '+') ? 'x' : '+';

        for (let move of possibleMoves) {
            let newBoard = moveboard(board, 'black', blackDir, move);
            let eval = minimax(newBoard, depth - 1, false, newBlackDir, whiteDir, alpha, beta);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break; // Prune the search tree
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        let possibleMoves = findallmoves(board, 'white', whiteDir);
        let newWhiteDir = (whiteDir === '+') ? 'x' : '+';

        for (let move of possibleMoves) {
            let newBoard = moveboard(board, 'white', whiteDir, move);
            let eval = minimax(newBoard, depth - 1, true, blackDir, newWhiteDir, alpha, beta);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) break; // Prune the search tree
        }
        return minEval;
    }
}


function boardToString(board) {
    return board.flat().join('');
}

let transposition = new Map(); // Memoization cache

function adaptiveDepth(board) {
    let total = 0;
    for (let row of board)
        for (let cell of row)
            if (cell === 'black' || cell === 'white') total++;
    return total > 6 ? 6 : 10;  // Shallower depth if board is full
}

function findBestMove(board, player, playerDir, opponentDir) {
    let bestMove = null;
    let bestValue = (player === 'black') ? -Infinity : Infinity;
    let possibleMoves = findallmoves(board, player, playerDir);

    // Sort moves to improve pruning
    possibleMoves.sort((a, b) => {
        let newBoardA = moveboard(board, player, playerDir, a);
        let newBoardB = moveboard(board, player, playerDir, b);
        let scoreA = evaluate(newBoardA);
        let scoreB = evaluate(newBoardB);
        return (player === 'black') ? (scoreB - scoreA) : (scoreA - scoreB);
    });

    for (let move of possibleMoves) {
        let newBoard = moveboard(board, player, playerDir, move);
        let newPlayerDir = (playerDir === '+') ? 'x' : '+';
        let moveValue = minimax(
            newBoard,
            adaptiveDepth(array),
            player === 'white', // Maximize if next turn is black
            player === 'black' ? newPlayerDir : opponentDir,
            player === 'white' ? newPlayerDir : opponentDir,
            -Infinity,
            Infinity
        );

        if ((player === 'black' && moveValue > bestValue) || 
            (player === 'white' && moveValue < bestValue)) {
            bestValue = moveValue;
            bestMove = move;
            score = moveValue;
        }
    }

    return bestMove;
}





// Check if the game is over (no more valid moves, or checkmate, etc.)
function gameOver(board) {
    var whitenumber=0
    var blacknumber=0
    for(var i=0; i<board.length; i++){
                    for(var j=0; j<board.length; j++){
                        if(board[i][j]=='white'){
                            whitenumber++
                        }
                        if(board[i][j]=='black'){
                            blacknumber++
                        }
                    }
                }
                if(whitenumber==0 || blacknumber==0){
                    return true
                }
   else {return false;}
}
function aimove() {
    if (turn === 1) {
        let best = findBestMove(array, 'black', dirs[1], dirs[0]);
        if (best) {
            let from = best[0];
            let to = best[1];
            array[from[0]][from[1]] = '';
            array[to[0]][to[1]] = 'black';
            dirs[1] = (dirs[1] === '+') ? 'x' : '+';
            turn = 0;
            draw();
            console.log(score);
        }
    }

    else if (turn === 0) {
        let best = findBestMove(array, 'white', dirs[0], dirs[1]);
        if (best) {
            let from = best[0];
            let to = best[1];
            array[from[0]][from[1]] = '';
            array[to[0]][to[1]] = 'white';
            dirs[0] = (dirs[0] === '+') ? 'x' : '+';
            turn = 1;
            draw();
            console.log(score);
        }
    }
}


       draw()