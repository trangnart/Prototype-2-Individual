//http://localhost:4000/?spiderman
title = "SPIDER MAN";
description = `
Use web strike

 [Press key H]
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

let isKeyPressing = false;
let piles;
let p, v;
let anchor;
let nearest;
let scr;
let minDist;
let dist;
let nextAnchorDist;
let enemy;
let startTicks = 0;
let power = [];

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyH") {
    isKeyPressing = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "KeyH") {
    isKeyPressing = false;
    anchor = null;
  }
});

function update() {
  if (!startTicks) {
    startTicks = ticks;
    piles = [];
    p = vec(99, (nextAnchorDist = 9));
    v = vec();
    anchor = nearest = null;
    enemy = {
      pos: vec(rnd(10, 90), 0),
      radius: 10,
    };
  }
  score += scr = (p.x > 30 ? (p.x - 30) * 0.1 : 0) + difficulty * 0.1;
  p.x -= scr;
  if ((v.y += 0.02) < 0 && p.y < 0) {
    v.y *= -1;
  }
  if (
    p.y > 99 ||
    (p.x > enemy.pos.x - 8 &&
      p.x < enemy.pos.x + 8 &&
      p.y > enemy.pos.y - 8 &&
      p.y < enemy.pos.y + 8)
  ) {
    play("lucky");
    startTicks = 0;
    end();
  }
  p.add(v.mul(0.99));
  color("red");
  box(p, 7, 7); // spiderman

  minDist = 99;
  piles.map((m) => {
    dist = abs(m.y - p.y);
    if (m.x > p.x && dist < minDist) {
      minDist = dist;
      nearest = m;
    }
  });

  color("yellow");
  if (nearest) {
    box(nearest, 9, 9);
    if (isKeyPressing) {
      play("select");
      anchor = nearest;
    }
  }
  if (isKeyPressing && anchor) {
    v.add(vec(anchor).sub(p).div(199));
    line(p, anchor);
    if (anchor.x < 0) {
      anchor = null;
    }
  }

  if (!isKeyPressing) {
    anchor = null;
  }

  if ((nextAnchorDist -= scr) < 0) {
    nextAnchorDist += rnd(9, 66);
    piles.push(vec(99, rnd(66)));
  }

  // Update and draw enemy
  if (ticks - startTicks > 200) {
  enemy.pos.y += 1;
  if (enemy.pos.y > 99) {
    enemy.pos.y = 0;
    enemy.pos.x = rnd(10, 90);
  }
  color("green"); // enemy
  box(enemy.pos, enemy.radius, enemy.radius);}

  color("black"); // building
  piles = piles.filter((m) => {
    m.x -= scr;
    box(m, 5, 5);
    return m.x > 0;
  });

  power.map((pwr) => {
    pwr.x -= scr;
    color("blue"); // power
    const isColliding = box(pwr, 2, 2).isColliding.rect;
    if (isColliding.red) {
      score += 20;
      power = power.filter((p) => p.x !== pwr.x || p.y !== pwr.y);
    }
  });

  if (rnd() < difficulty * 0.01) {
    const yPos = rnd(5, 95);
    power.push(vec(99, yPos));
  }
}
