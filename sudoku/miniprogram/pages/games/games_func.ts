// 初始化81个false
export function init81False(): boolean[]{
    let tmp: boolean[] = [];
    for(let i = 0; i < 81; i++){
      tmp.push(false);
    }
    return tmp;
}

export function getlevel(level: number) :string{
    let rst: string = '入门';
    switch(level){
      case 1:
        rst = '入门';
        break;
      case 2:
        rst = '简单';
        break;
      case 3:
        rst = '中级';
        break;
      case 4:
        rst = '困难';
        break;
      case 5:
        rst = '专家';
        break;
    }
    return rst;
}

export function formatTime(useSeconds: number) {
    const h = padTime(Math.floor(useSeconds / 3600));
    const m = padTime(Math.floor((useSeconds % 3600) / 60));
    const s = padTime(useSeconds % 60);
    return `${h}:${m}:${s}`;
}

function padTime(time: number) {
    return time < 10 ? `0${time}` : `${time}`;
}

// 获取并设置关联的cell索引为true
export function connectCellIndexs(index: number): boolean[]{
    let tmp = init81False();
    let indexs = getConnectCell(index);
    for(let i = 0; i < indexs.length; i++){
        tmp[indexs[i]] = true;
    }
    return tmp;
}

// 获取并设置相同数字的索引为true
export function sameNumCellIndexs(answer: number[], val: number): boolean[]{
    let tmp = init81False();
    let indexs = getSameCell(answer, val);
    for(let i = 0; i < indexs.length; i++){
        tmp[indexs[i]] = true;
    }
    return tmp;
}

// 获取关联的cell
function getConnectCell(index: number):number[]{
    let rst: number[] = [];

    let col: number[][] = cellCols();
    let row: number[][] = cellRows();
    let squ: number[][] = cellSqus();

    for(let i = 0; i < 9; i++){
        if(col[i].includes(index)){
            rst.push(...col[i]);
            break;
        }
    }
    for(let i = 0; i < 9; i++){
        if(row[i].includes(index)){
            rst.push(...row[i]);
            break;
        }
    }
    for(let i = 0; i < 9; i++){
        if(squ[i].includes(index)){
            rst.push(...squ[i]);
            break;
        }
    }
    return Array.from(new Set(rst));
}

function cellCols():number[][]{
    let col: number[][] =[
        [0,  1,  2,  3,  4,  5,  6,  7,  8],
        [9,  10, 11, 12, 13, 14, 15, 16, 17],
        [18, 19, 20, 21, 22, 23, 24, 25, 26],
        [27, 28, 29, 30, 31, 32, 33, 34, 35],
        [36, 37, 38, 39, 40, 41, 42, 43, 44],
        [45, 46, 47, 48, 49, 50, 51, 52, 53],
        [54, 55, 56, 57, 58, 59, 60, 61, 62],
        [63, 64, 65, 66, 67, 68, 69, 70, 71],
        [72, 73, 74, 75, 76, 77, 78, 79, 80],
    ];
    return col;
}

function cellRows():number[][]{
    let row: number[][] = [
        [0,  9,  18, 27, 36, 45, 54, 63, 72],
        [1,  10, 19, 28, 37, 46, 55, 64, 73],
        [2,  11, 20, 29, 38, 47, 56, 65, 74],
        [3,  12, 21, 30, 39, 48, 57, 66, 75],
        [4,  13, 22, 31, 40, 49, 58, 67, 76],
        [5,  14, 23, 32, 41, 50, 59, 68, 77],
        [6,  15, 24, 33, 42, 51, 60, 69, 78],
        [7,  16, 25, 34, 43, 52, 61, 70, 79],
        [8,  17, 26, 35, 44, 53, 62, 71, 80],
    ];
    return row;
}
function cellSqus(): number[][]{
    let squ: number[][] = [
        [0,  1,  2,  9,  10, 11, 18, 19, 20],
        [3,  4,  5,  12, 13, 14, 21, 22, 23],
        [6,  7,  8,  15, 16, 17, 24, 25, 26],
        [27, 28, 29, 36, 37, 38, 45, 46, 47],
        [30, 31, 32, 39, 40, 41, 48, 49, 50],
        [33, 34, 35, 42, 43, 44, 51, 52, 53],
        [54, 55, 56, 63, 64, 65, 72, 73, 74],
        [57, 58, 59, 66, 67, 68, 75, 76, 77],
        [60, 61, 62, 69, 70, 71, 78, 79, 80],
    ];
    return squ;
}

// 获取相同数字的cell
function getSameCell(answer: number[], val: number): number[]{
    let rst: number[] = [];
    if(val == 0){
        return rst;
    }
    for(let i = 0; i < answer.length; i++){
        if(answer[i] == val){
            rst.push(i);
        }
    }
    return rst;
}

export function leftUndoCell(doAnswer: number[]):number[]{
    let rst :number[] = [9, 9, 9, 9, 9, 9, 9, 9, 9];
    for(let i=0; i<rst.length; i++){
        for(let j = 0; j < doAnswer.length; j++){
            if(doAnswer[j] == i + 1){
                rst[i] = rst[i] - 1;
            }
        }
    }

    return rst;
}

export function checkCells(doAnswer: number[], index: number): number[]{
    let col: number[][] = cellCols();
    let row: number[][] = cellRows();
    let squ: number[][] = cellSqus();

    let rst: number[] = [];

    for(let i = 0; i < 9; i++){
        if(col[i].includes(index)){
            rst.push(...checkIsDone(doAnswer, col[i]));
            break;
        }
    }
    for(let i = 0; i < 9; i++){
        if(row[i].includes(index)){
            rst.push(...checkIsDone(doAnswer, row[i]));
            break;
        }
    }
    for(let i = 0; i < 9; i++){
        if(squ[i].includes(index)){
            rst.push(...checkIsDone(doAnswer, squ[i]))
            break;
        }
    }
    return rst;
}

function checkIsDone(doAnswer:number[], cells: number[]):number[]{
    let rst: number[] = [];
    let isdone: boolean = true;
    for(let j=0; j< cells.length; j++){
        if(doAnswer[cells[j]] == 0){
            isdone = false;
            break;
        }
    }
    if(isdone){
        rst.push(...cells);
    }
    return rst;
}

export async function sleepAt() {
    await sleep(1000); 
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}