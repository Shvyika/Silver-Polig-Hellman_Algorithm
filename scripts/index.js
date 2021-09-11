//Инициализация пустой строки для хода решения
let solution = '';

/*Факторизация числа*/
const factorize = (number) => {
    // Вывод решения
    solution += `1) Факторизация числа p - 1: <br>`;
    solution += `     p - 1 = ${number} = `;
    // Вывод решения

    let rezult = [];
    if(number < 0) {
        rezult.push(-1);
        number *= -1;
    }
    for(let i = 2; i <= Math.sqrt(number); i++) {
        let counter = 0;
        while(number % i === 0) {
            counter++;
            number /= i;
        }
        if(counter !== 0) {
            rezult.push({num: i, power: counter});
        }
    }
    if(number !== 1) {
        rezult.push({num: number, power: 1});
    }

    // Вывод решения
    for(let i = 0; i < rezult.length; i++) {
        if(i !== rezult.length - 1) {
            solution += `${rezult[i].num}<sup>${rezult[i].power}</sup> ⋅ `
        } else {
            solution += `${rezult[i].num}<sup>${rezult[i].power}</sup>`
        }
    }
    // Вывод решения

    return rezult;
};

/*Возведение в степень по модулю*/
const modPow = (a, b, p) => {
    if(b === 0) {
        return 1;
    }
    let result = 1;
    while(b) {
        if(b & 1) {
            result *= a;
            result %= p;
        }
        a *= (a % p);
        a %= p;
        b >>= 1;
    }
    return result % p;
}

/*Подсчёт всех r*/
const count_r = (a, p, factors) => {
    // Вывод решения
    solution += `<br> <br>`
    solution += `2) Подсчёт всех r: <br>`; 
    // Вывод решения

    let output = [];
    let temp = [];
    for(let i = 0; i < factors.length; i++) {
        for(let j = 0; j < factors[i].num; j++) {
            temp.push({r: modPow(a, j * ((p - 1) / factors[i].num), p), power: j * ((p - 1) / factors[i].num)});
        }
        output.push(temp);
        temp = [];
    }

    // Вывод решения
    for(let i = 0; i < output.length; i++) {
        for(let j = 0; j < output[i].length; j++) {
            solution += `     r<sub>${factors[i].num},${j}</sub> = ${a}<sup>${output[i][j].power}</sup>(mod${p}) = ${output[i][j].r} <br>`;
        }   
    }
    // Вывод решения

    return output;
};

/*Нахождение обратного элемента по модулю*/
const inverseMod = (x, mod) => {
    let a = x, b = mod, q, r, u1 = 1, v1 = 0, u2 = 0, v2 = 1, t;
    while(b != 0) {
        q = Math.floor(a / b);
        r = a % b;
        a = b; b = r;
        t = u2;
        u2  = u1 - q * u2;
        u1 = t;
        t = v2;
        v2 = v1 - q * v2;
        v1 = t;
    }
    u1 < 0 ? u1 += mod : u1;
    return u1;
};

//Нахождение решения системы сравнений по модулю
const find_solution = (x_array, factors) => {
    // Вывод решения
    solution += `<br>`;
    solution += `4) Решение системы сравнений по модулю: <br>`;
    // Вывод решения

    let mod = 1;
    for(let i = 0; i < factors.length; i++) {
        mod *= Math.pow(factors[i].num, factors[i].power);
    }
    let M_1 = [];
    for(let i = 0; i < factors.length; i++) {
        M_1.push(mod / Math.pow(factors[i].num, factors[i].power));
    }
    let M_2 = [];
    for(let i = 0; i < factors.length; i++) {
        M_2.push(inverseMod(M_1[i], Math.pow(factors[i].num, factors[i].power)));
    }
    let result = 0;
    for(let i = 0; i < factors.length; i++) {
        result += (x_array[i] * M_1[i] * M_2[i]);
    }

    // Вывод решения
    solution += `     x = `;
    for(let i = 0; i < factors.length; i++) {
        if(i !== factors.length - 1) {
            solution += `${x_array[i]}⋅${M_1[i]}⋅${M_2[i]} + `;
        } else {
            solution += `${x_array[i]}⋅${M_1[i]}⋅${M_2[i]} (mod${mod}) = `;
        }
    }
    solution += `${result % mod}`;
    // Вывод решения

    return result % mod;
};

//Подсчёт x для каждого q
const count_x = (a, b, p, factors, r_array) => {
    // Вывод решения
    solution += `<br>`;
    solution += `3) Подсчёт промежуточных x: <br>`;
    // Вывод решения

    let x_array = [];
    for(let i = 0; i < factors.length; i++) {
        // Вывод решения
        solution += `  - q = ${factors[i].num}: <br>`;
        solution += `      x = `;
        for(let j = 0; j < factors[i].power; j++) {
            if(j !== factors[i].power - 1) {
                solution += `${Math.pow(factors[i].num, j)}⋅x<sub>${j}</sub> + `;
            } else {
                solution += `${Math.pow(factors[i].num, j)}⋅x<sub>${j}</sub> (mod${Math.pow(factors[i].num, factors[i].power)}) `;
            }    
        }
        solution += `<br>`;
        // Вывод решения

        let temp_x = Array(factors[i].power).fill(0, 0, factors[i].power);
        let counter = 0;
        for(let j = 0; j < factors[i].power; j++) {
            let power = 0;
            for(let k = 0; k < factors[i].power; k++) {
                power += temp_x[k] * Math.pow(factors[i].num, k);
            }
            let temp_1 = inverseMod(modPow(a, power, p), p);
            let temp_2 = (p - 1) / Math.pow(factors[i].num, j + 1);
            let z = modPow((b * temp_1), temp_2, p);

            // Вывод решения
            solution += `       (${b} ⋅ ${a}<sup>-${power}</sup>)<sup>${p - 1}/${Math.pow(factors[i].num, j + 1)}</sup>(mod${p}) = `;
            solution += `(${b} ⋅ ${temp_1})<sup>${temp_2}</sup>(mod${p}) = ${z} `;
            // Вывод решения

            for(let k = 0; k < r_array[i].length; k++) {
                if(z === r_array[i][k].r) {
                    let temp_3 = r_array[i][k].power / ((p - 1) / factors[i].num);
                    temp_x[counter] = temp_3;

                    // Вывод решения
                    solution += `=> x<sub>${j}</sub> = ${r_array[i][k].power} / ${(p - 1) / factors[i].num} = ${temp_3} <br>`;
                    // Вывод решения

                    break;
                }
            }  
            counter++;
        }

        // Вывод решения
        solution += `      x = `;
        let x = 0;
        for(let j = 0; j < temp_x.length; j++) {
            x += temp_x[j] * Math.pow(factors[i].num, j);
            if(j !== temp_x.length - 1) {
                solution += `${Math.pow(factors[i].num, j)}⋅${temp_x[j]} + `;
            } else {
                solution += `${Math.pow(factors[i].num, j)}⋅${temp_x[j]} (mod${Math.pow(factors[i].num, factors[i].power)}) = ${x} <br>`;
            }  
        }
        // Вывод решения

        x_array.push(x % Math.pow(factors[i].num, factors[i].power));
    }
    return x_array;
};

//Алгоритм
const SPH = (a, b, p) => {
    const factors = factorize(p - 1);
    const r_array = count_r(a, p, factors);
    const x_array = count_x(a, b, p, factors, r_array);
    const answer = find_solution(x_array, factors);
    return answer;
};

document.getElementById('submit').onclick = (event) => {
    event.preventDefault();
    const a = Number(document.getElementById('a').value);
    const b = Number(document.getElementById('b').value);
    const p = Number(document.getElementById('p').value);

    if(!a || !b || !p) {
        alert('Заполните поля!');
        return;
    }

    const x = SPH(a, b, p);
    document.getElementById('solution-text').innerHTML = solution;
    solution = '';
    document.getElementById('result-text').innerHTML = `x = ${x}`;

};