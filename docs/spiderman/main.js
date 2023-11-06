title = "SPIDER MAN";
//http://localhost:4000/?spiderman
description = `
[Hold]
 Hold webb
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
  if (!ticks) {
    piles = [];
    p = vec(99, (nextAnchorDist = 9));
    v = vec();
    anchor = nearest = null;
  }
  score += scr = (p.x > 30 ? (p.x - 30) * 0.1 : 0) + difficulty * 0.1;
  p.x -= scr;
  if ((v.y += 0.02) < 0 && p.y < 0) {
    v.y *= -1;
  }
  if (p.y > 99) {
    play("lucky");
    end();
  }
  p.add(v.mul(0.99));
  color("red");
  box(p, 7, 7);
  minDist = 99;
  piles.map((m) => {
    dist = abs(m.y - p.y);
    if (m.x > p.x && dist < minDist) {
      minDist = dist;
      nearest = m;
    }
  });
  color("red");
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
  color("black");
  piles = piles.filter((m) => {
    m.x -= scr;
    box(m, 5, 5);
    return m.x > 0;
  });
}