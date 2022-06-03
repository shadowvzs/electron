export class DateEx extends Date {

	constructor(...a) {
		super(...a);
		this.toMySQLDate = this.toMySQLDate.bind(this);
		this.isBefore = this.isBefore.bind(this);
		this.isAfter = this.isAfter.bind(this);
		this.clone = this.clone.bind(this);
		this.getObjectForm = this.getObjectForm.bind(this);
		this.add = this.add.bind(this);
		this.substract = this.substract.bind(this);
		this.set = this.set.bind(this);
	}

    toMySQLDate() {
        return `${this.getFullYear()}-${(""+(this.getMonth() + 1)).padStart(2, '0')}-${(""+this.getDate()).padStart(2, '0')} ${(""+this.getHours()).padStart(2, '0')}:${(""+this.getMinutes()).padStart(2, '0')}:${(""+this.getSeconds()).padStart(2, '0')}`;
    }
    

    isBefore(target) {
        if (typeof target === 'string') { target = new DateEx(target); }
        return this.getTime() < target.getTime();
    }

    isAfter(target) {
        if (typeof target === 'string') { target = new DateEx(target); }
        return this.getTime() > target.getTime();
    }

    clone() {
        return new DateEx(this.getTime());
    }

    getObjectForm() {
         return {
            day: this.getDate(),
            month: this.getMonth() + 1,
            year: this.getFullYear(),
            hour: this.getHours(),
            min: this.getMinutes(),
            sec: this.getSeconds()
        }
    }

    add(modifier) {
        const { 
            year, 
            month, 
            day,
            hour,
            min,
            sec 
        } = modifier;
        if (day) this.setSeconds(this.getSeconds() + sec);
        if (min) this.setMinutes(this.getMinutes() + min);
        if (hour) this.setHours(this.getHours() + hour);
        if (day) this.setDate(this.getDate() + day);
        if (month) this.setMonth(this.getMonth() + month - 1);
        if (year) this.setFullYear(this.getFullYear() + year);
        return this;
    }

    substract(modifier) {
        const { 
            year, 
            month, 
            day,
            hour,
            min,
            sec 
        } = modifier;
        if (day) this.setSeconds(this.getSeconds() - sec);
        if (min) this.setMinutes(this.getMinutes() - min);
        if (hour) this.setHours(this.getHours() - hour);
        if (day) this.setDate(this.getDate() - day);
        if (month) this.setMonth(this.getMonth() - month - 1);
        if (year) this.setFullYear(this.getFullYear() - year);
        return this;
    }
    
    set(modifier) {
        const { 
            year, 
            month, 
            day,
            hour,
            min,
            sec 
        } = modifier;
        if (day) this.setSeconds(sec);
        if (min) this.setMinutes(min);
        if (hour) this.setHours(hour);
        if (day) this.setDate(day);
        if (month) this.setMonth(month - 1);
        if (year) this.setFullYear(year);
        return this;
    }
}