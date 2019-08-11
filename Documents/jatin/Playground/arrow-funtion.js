var square = x => x * x;
//console.log(square(9));

var user =
{
  name: 'Jatin',
  sayHi: () =>
  {
    //console.log(`Hi, i'm ${this.name}`);
  }
,
  sayHiAll: ()
  {
    //console.log(`Hi, i'm ${this.name}`);
  }
};

user.sayHiAll();
