/*Факторизация числа*/
const factorize = (number) => {
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
    let output = [];
    let temp = [];
    for(let i = 0; i < factors.length; i++) {
        for(let j = 0; j < factors[i].num; j++) {
            temp.push({r: modPow(a, j * ((p - 1) / factors[i].num), p), power: j * ((p - 1) / factors[i].num)});
        }
        output.push(temp);
        temp = [];
    }
    return output;
};

/*Наименьшее общее кратное*/
const gcd = (a, b) => {
    while(a !== 0 && b !== 0) {
        a > b ? a -= b : b -= a;
    }
    return Math.max(a, b);
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
    return result % mod;
};

//Подсчёт x для каждого q
const count_x = (a, b, p) => {
    const factors = factorize(p - 1);
    const r_array = count_r(a, p, factors);
    let x_array = [];
    for(let i = 0; i < factors.length; i++) {
        let temp_x = Array(factors[i].power).fill(0, 0, factors[i].power);
        let counter = 0;
        for(let j = 0; j < factors[i].power; j++) {
            let power = 0;
            for(let k = 0; k < factors[i].power; k++) {
                power += temp_x[k] * Math.pow(factors[i].num, k);
            }
            z = modPow((b * inverseMod(modPow(a, power, p), p)), (p - 1) / Math.pow(factors[i].num, j + 1), p);
            for(let k = 0; k < r_array[i].length; k++) {
                if(z === r_array[i][k].r) {
                    temp_x[counter] = r_array[i][k].power / ((p - 1) / factors[i].num);
                    break;
                }
            }
            counter++;
        }
        let x = 0;
        for(let j = 0; j < temp_x.length; j++) {
            x += temp_x[j] * Math.pow(factors[i].num, j);
        }
        x_array.push(x % Math.pow(factors[i].num, factors[i].power));
    }
    return x_array;
};

//Алгоритм
const SPH = (a, b, p) => {
    return find_solution(count_x(a, b, p), factorize(p - 1));
};

document.getElementById('submit').onclick = (event) => {
    event.preventDefault();
    const a = Number(document.getElementById('a').value);
    const b = Number(document.getElementById('b').value);
    const p = Number(document.getElementById('p').value);

    document.getElementById('result_text').innerHTML = `x = ${SPH(a, b, p)}`;
};