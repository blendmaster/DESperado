/* code compiled to des.js from des.co */
(function(){
  "use strict";
  var flatten, bits, dec, bin4, permute, split, leftShift, cons, xor, festiel, des, rand, zeroes, input, key, output, read, write, compute, save, load, i$, ref$, len$, td, slice$ = [].slice;
  flatten = function(it){
    return Array.prototype.concat.apply([], it);
  };
  bits = function(it){
    return Array.prototype.slice.call(it).map(function(it){
      return parseInt(it, 2);
    });
  };
  dec = function(){
    var bits;
    bits = slice$.call(arguments);
    return parseInt(bits.join(''), 2);
  };
  bin4 = function(it){
    var _;
    _ = it.toString(2);
    _ = repeatString$('0', 4 - _.length) + _;
    return bits(_);
  };
  permute = function(it, indices){
    var i$, len$, i, results$ = [];
    for (i$ = 0, len$ = indices.length; i$ < len$; ++i$) {
      i = indices[i$];
      results$.push(it[i - 1]);
    }
    return results$;
  };
  split = function(it, pieces){
    var len, i, to$, results$ = [];
    pieces == null && (pieces = 2);
    len = Math.floor(it.length / pieces);
    for (i = 0, to$ = it.length; len < 0 ? i > to$ : i < to$; i += len) {
      results$.push(it.slice(i, i + len));
    }
    return results$;
  };
  leftShift = function(it, times){
    var i;
    for (i = 0; i < times; ++i) {
      it.push(it.shift());
    }
    return it;
  };
  cons = function(){
    return Array.prototype.concat.apply([], arguments);
  };
  xor = function(a, b){
    var i, to$, results$ = [];
    for (i = 0, to$ = a.length; i < to$; ++i) {
      results$.push(a[i] ^ b[i]);
    }
    return results$;
  };
  festiel = function(it, key){
    var _;
    _ = it;
    _ = permute(_, E);
    _ = xor(_, key);
    _ = split(_, 8);
    _ = _.map(function(it, i){
      return bin4(S[i][dec(it[0], it[5])][dec(it[1], it[2], it[3], it[4])]);
    });
    _ = flatten(_);
    return permute(_, P);
  };
  des = function(input, key){
    var keys, i, ref$, left, right, round;
    input = permute(input, IP);
    key = permute(key, PC1);
    keys = [key];
    for (i = 0; i < 16; ++i) {
      keys[i + 1] = cons(leftShift(keys[i].slice(0, 28), SHIFT[i]), leftShift(keys[i].slice(28, 56), SHIFT[i]));
    }
    keys.shift();
    keys = keys.map(function(it){
      return permute(it, PC2);
    });
    document.getElementById('keys').textContent = keys.map(function(it, i){
      return (i < 10 ? " " + i : i) + ": " + it.join(' ');
    }).join('\n');
    ref$ = split(input), left = ref$[0], right = ref$[1];
    for (round = 0; round < 16; ++round) {
      ref$ = [right, xor(left, festiel(right, keys[round]))], left = ref$[0], right = ref$[1];
    }
    return permute(cons(right, left), IP1);
  };
  rand = function(){
    var i, results$ = [];
    for (i = 0; i < 64; ++i) {
      results$.push(Math.floor(Math.random() * 2));
    }
    return results$;
  };
  zeroes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  input = document.querySelectorAll('#input td');
  key = document.querySelectorAll('#key td');
  output = document.querySelectorAll('#output td');
  read = function(it){
    var i$, len$, i, results$ = [];
    for (i$ = 0, len$ = it.length; i$ < len$; ++i$) {
      i = it[i$];
      results$.push(parseInt(i.textContent, 2));
    }
    return results$;
  };
  write = function(bits, it){
    var i, len$, b, x$;
    for (i = 0, len$ = bits.length; i < len$; ++i) {
      b = bits[i];
      x$ = it[i];
      x$.textContent = b;
      x$.className = b;
    }
  };
  compute = function(){
    write(des(read(input), read(key)), output);
  };
  save = function(name, it){
    localStorage[name + "_bits"] = JSON.stringify(it);
    return it;
  };
  load = function(it){
    try {
      return JSON.parse(localStorage[it + "_bits"]);
    } catch (e$) {}
  };
  write(load('key') || rand(), key);
  write(load('input') || rand(), input);
  compute();
  for (i$ = 0, len$ = (ref$ = document.querySelectorAll('#input td, #key td')).length; i$ < len$; ++i$) {
    td = ref$[i$];
    td.addEventListener('click', fn$);
  }
  document.getElementById('zero-key').addEventListener('click', function(){
    write(save('key', zeroes), key);
    compute();
  });
  document.getElementById('rand-key').addEventListener('click', function(){
    write(save('key', rand()), key);
    compute();
  });
  document.getElementById('zero-input').addEventListener('click', function(){
    write(save('input', zeroes), input);
    compute();
  });
  document.getElementById('rand-input').addEventListener('click', function(){
    write(save('input', rand()), input);
    compute();
  });
  function repeatString$(str, n){
    for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
    return r;
  }
  function fn$(){
    this.textContent = this.textContent === '1' ? 0 : 1;
    this.className = this.textContent;
    save('key', read(key));
    save('input', read(input));
    compute();
  }
}).call(this);
