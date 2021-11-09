// Class definition for celestial object

class star {

	constructor(name,ra,dec,teff,pl_pnum,st_rad,st_optmag,st_dist) {

		this.setName(name);
		this.setRA(ra);
		this.setDec(dec);
		this.setTeff(teff);
		this.setPlNum(pl_pnum);
		this.setStRad(st_rad);
		this.setApMag(st_optmag);
		this.setDist(st_dist);
		this.setSpecTypes(this.teff);
		this.setHabZone();
		this.planets = [];
	}
	// Setter
	setName(name) {
		this.name = name;
	}
	setRA(ra) {
		this.ra = ra;
	}
	setDec(dec) {
		this.dec = dec;
	}
	setTeff(teff) {
		this.teff = teff;
	}
	setPlNum(pl_pnum) {
		this.PlNum = pl_pnum;
	}
	setStRad(st_rad) {
		if (st_rad >0) {
			this.StRad = st_rad;
		} else {
			this.StRad = -1;
		}

	}
	setApMag(st_optmag) {
		this.ApMag = st_optmag;
	}
	setDist(st_dist) {
		this.Dist=st_dist;
	}
	setSpecTypes(teff){
		if (this.teff<3500) {
			this.SpecType = "M";
			this.Color = "Red";
			this.BolCons = -2.0;
	    } else if (this.teff>3500 && this.teff<5000) {
    		this.SpecType = "K";
    		this.Color = "Orange";
    		this.BolCons = -0.8;
	    } else if (this.teff>5000 && this.teff<6000) {
      		this.SpecType = "G";
      		this.Color = "yellow";
      		this.BolCons = -0.4;
   		} else if (this.teff>6000 && this.teff<7500) {
   			this.SpecType = "F";
   			this.Color = "White";
   			this.BolCons = -0.15;
	    } else if (this.teff>7500 && this.teff<11000) {
	    	this.SpecType = "A";
	    	this.Color = "LightBlue";
	    	this.BolCons = -0.3;
   		} else if (this.teff>11000 && this.teff<25000) {
      		this.SpecType = "B";
      		this.Color = "blue";
      		this.BolCons = -2.0;
      	} else if (this.teff>25000) {
      		this.SpecType = "O";
			this.Color = "black";
			this.BolCons = null; 
    	} else {
    		this.teff=null;
			this.Color = "gray";
    	}
	}

	setHabZone() {
		if (this.BolCons!=null) {
			
			var absmag = this.ApMag-5*Math.log10(this.Dist/10);
			var bolmag = absmag + this.BolCons;
			var abslum = Math.pow(10,((bolmag - 4.75)/-2.5));
			this.HabZoneMin = Math.sqrt(abslum/1.1);
			this.HabZoneMax = Math.sqrt(abslum/0.53);

		}
	}
	setPlanets(planetname,pl_orbsmax,pl_radius,pl_mass) {
		let object = [];
		if (pl_orbsmax<=this.HabZoneMax && pl_orbsmax>=this.HabZoneMin){
			if (pl_radius<=2.50){
				object = [planetname,pl_orbsmax,pl_radius,pl_mass,true];
			} else if ((pl_mass<=10) && !(pl_radius >2.50) ){
				object = [planetname,pl_orbsmax,pl_radius,pl_mass,true];
			} 
		} else {
			object = [planetname,pl_orbsmax,pl_radius,pl_mass,false]
		}
		this.planets.push(object);
	}
	// Getter
	getName() {
		return this.name;
	}
	getRA() {
		return this.ra;
	}
	getDec() {
		return this.dec;
	}
	getTeff() {
		return this.teff;
	}
	getPlNum() {
		return this.PlNum;
	}
	getStRad() {
		return this.StRad;
	}
	getApMag() {
		return this.ApMag;
	}
	getDist() {
		return this.Dist;
	}
	getType() {
		return this.SpecType;
	}
	getColor() {
		return this.Color;
	}
	getHabZoneMin() {
		return this.HabZoneMin;
	}
	getHabZoneMax() {
		return this.HabZoneMax;
	}
	getPlanets() {
		return this.planets;
	}
}
