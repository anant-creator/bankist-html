'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Anant Gupta',
  movements: [200000, 4500, -4000, 3000, -6500, -1300, 700, 13000],
  interestRate: 3, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Nitish Gupta',
  movements: [50000, 34000, -1500, -7900, -32100, -10000, 85000, -300],
  interestRate: 1,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Sumit Gupta',
  movements: [20000, -2000, 34000, -3000, -200, 500, 4000, -4600],
  interestRate: 3,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Kushagra Vaish',
  movements: [4300, 10000, 37000, 500, 900],
  interestRate: 2,
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

function users(arg) {
  for (const i of arg) {
    i.username = i.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  }
}

users(accounts);
let time = 300;

function logoutTimer() {
  const timer = setInterval(function () {
    let min = String(Math.trunc(time / 60));
    let sec = String(time % 60);
    labelTimer.textContent = `${min}:${sec}`;
    console.log(`${min}:${sec}`);

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    time--;
  }, 1000);
}
// Login Interface
let currentUser;

const now = new Date();
labelDate.textContent = new Intl.DateTimeFormat('en-GB').format(now);

btnLogin.addEventListener('click', function userLogin(e) {
  e.preventDefault();

  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentUser.owner.split(' ')[0]
    }`;
    // Hide Essential
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // Display UI
    containerApp.style.opacity = 100;
    // Display Transactions
    displayMovements(currentUser);
    // Display All Balances
    balances(currentUser);
    //Logout timer
    time = 300;
    logoutTimer();
  } else {
    labelWelcome.textContent = `Wrong Input Username or password`;
    inputLoginUsername.value = inputLoginPin.value = ' ';
  }
});

function balances(acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.innerHTML = `&#8377; ${acc.balance}`;

  const deposits = acc.movements
    .filter(a => a > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.innerHTML = `&#8377; ${deposits}`;

  const withdraws = acc.movements
    .filter(a => a < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.innerHTML = `&#8377; ${Math.abs(withdraws)}`;

  const interest = acc.movements
    .filter(a => a >= 10000)
    .map(a => (a * 3) / 100)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.innerHTML = `&#8377; ${interest}`;
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  let mov = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  mov.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const day = date.getDate();
    6;
    const month = date.getMonth();
    const year = date.getFullYear();

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${day}/${month}/${year}</div>
      <div class="movements__value">&#8377;${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

btnTransfer.addEventListener(
  'click',
  function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const recieverAccount = accounts.find(
      acc => acc.username === inputTransferTo.value
    );
    if (
      amount > 0 &&
      currentUser.balance > amount &&
      recieverAccount?.username !== currentUser.username
    ) {
      currentUser.movements.push(-amount);
      recieverAccount.movements.push(amount);
      displayMovements(currentUser);
      inputTransferAmount.value = inputTransferTo.value = '';
      balances(currentUser);
      time = 300;
    }
  }
  // inputTransferAmount;
);

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentUser, !sorted);
  sorted = !sorted;
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentUser.username === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    accounts.splice(currentUser, 1);
    containerApp.style.opacity = 0;
    // location.reload();
    console.log(accounts);
  } else {
    console.log(inputCloseUsername.value);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputLoanAmount.value < (currentUser.balance * 50) / 100) {
    const amt = Number(inputLoanAmount.value);
    inputLoanAmount.value = inputTransferTo.value = '';
    time = 300;
    setTimeout(function () {
      currentUser.movements.push(amt);
      displayMovements(currentUser);
      balances(currentUser);
    }, 1000);
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const deposit = movements.filter(mov => mov > 0);
// const withdrawal = movements.filter(mov => mov < 0);
// const bal = movements.reduce((mov, i) => mov + i);

// const totalDeposits = movements
//   .filter(a => a > 0)
//   .map(mov => Math.trunc(mov * 1.1))
//   .reduce((a, b) => a + b, 0);
// console.log(totalDeposits);

// if (recieverAccount.value !== currentUser) {
//   if (amount > currentUser.balance) {
//     console.log(`Jhinga Lala Hu`);
//   }
// }

// btnLogin.addEventListener(
//   'click',
//   window.setTimeout(function () {
//     for (let i = 5; i > 1; i--) {
//       for (let j = 60; j < 1; j--) {
//         console.log(`${i}:${j}`);
//       }
//     }
//   }, 1000)
// );

let d = new Date();
// console.log(d);
let a = d.getDate();
