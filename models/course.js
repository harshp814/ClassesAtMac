module.exports = {
    course: function(code, name, dpt, section, start, day, end, room, prof, term, credits, section_full) {
                this.code = code;
                this.name = name;
                this.department = dpt;
                this.section = section;
                this.start = start;
                this.day = day;
                this.end = end;
                this.room = room;
                this.prof = prof;
                this.term = term;
                this.credits = credits;
                this.section_full = section_full; 
            }
}