import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { REAL_STUDENTS, REAL_FACULTY, ROUND_PERFORMANCE, CLASS_ROUND_PERFORMANCE, TEACHER_PERFORMANCE, TIMETABLE, ASSIGNMENTS, TRANSACTIONS, getGrade } from '../data';

// ─── Helper: Format a full student result card ──────────────────────
const formatStudentCard = (s) => {
    const g = getGrade(s.marks);
    const roundStudent = Object.entries(ROUND_PERFORMANCE.students).find(([, rs]) => rs.name === s.name && rs.class === s.class);
    const roundStr = roundStudent
        ? ROUND_PERFORMANCE.rounds.map((r, i) => `• ${r}: ${roundStudent[1].scores[i]}%`).join('\n')
        : 'N/A';
    const subjStr = Object.entries(s.subjects).map(([sub, marks]) => `• ${sub}: ${marks}/100`).join('\n');
    return `👩‍🎓 **${s.name}**\n\n🏫 Class: **${s.class}**\n📊 Marks: **${s.marks}%** (Grade: ${g.grade})\n📝 Roll: ${s.roll}\n📋 Status: ${s.status}\n💰 Fee: ${s.fee}\n📅 Attendance: ${s.attendance}%\n\n**Round-wise Scores:**\n${roundStr}\n\n**Subject Breakdown:**\n${subjStr}`;
};

// ─── Helper: Fuzzy-match a query against all names ──────────────────
const fuzzyFindStudents = (q) => {
    const words = q.replace(/[^a-z\s]/gi, '').toLowerCase().split(/\s+/).filter(w => w.length >= 2);
    if (words.length === 0) return [];
    return REAL_STUDENTS.filter(s => {
        const name = s.name.toLowerCase();
        return words.every(w => name.includes(w));
    });
};

const fuzzyFindTeachers = (q) => {
    const words = q.replace(/[^a-z\s.]/gi, '').toLowerCase().split(/\s+/).filter(w => w.length >= 2);
    if (words.length === 0) return [];
    // Search in both REAL_FACULTY and TEACHER_PERFORMANCE
    const faculty = REAL_FACULTY.filter(f => {
        const name = f.name.toLowerCase();
        return words.some(w => name.includes(w));
    });
    const teachers = TEACHER_PERFORMANCE.filter(t => {
        const name = t.name.toLowerCase();
        return words.some(w => name.includes(w));
    });
    return { faculty, teachers };
};

// ─── Data Query Engine ───────────────────────────────────────────────
const queryEngine = (input) => {
    const q = input.toLowerCase().trim();
    const qClean = q.replace(/[?!.,]/g, '');

    // ── Greetings ──
    if (/^(hi|hello|hey|assalam|salam|aoa|good morning|good afternoon|good evening)/.test(qClean)) {
        return `Hello! 👋 I'm **CMS Assistant**, your school data companion. I have access to all **${REAL_STUDENTS.length} students** across **4 classes** and **${REAL_FACULTY.length} faculty members**.\n\nJust type anything! For example:\n• A student name like **\"Qisa Fatima\"**\n• A roll number like **\"CMS-696\"**\n• A class like **\"9th Rose\"**\n• A teacher like **\"Sir Kamran\"**\n• Or ask: **\"topper\"**, **\"result card\"**, **\"timetable\"**, **\"at-risk\"**`;
    }

    // ── Help / what can you do ──
    if (/^(help|what can you|commands|guide|menu|options)/.test(qClean)) {
        return `Here's what I can help with:\n\n👩‍🎓 **Students** — Just type any name or roll number\n📋 **Result Card** — \"result card Qisa Fatima\"\n🏫 **Class Report** — \"9th Rose\", \"10th Jasmine\"\n🏆 **Rankings** — \"topper\", \"top 5\", \"bottom 5\"\n🚨 **At-Risk** — \"at-risk students\"\n👩‍🏫 **Teachers** — Type any teacher name\n📊 **Stats** — \"overview\", \"pass rate\", \"average\"\n📅 **Timetable** — \"timetable\", \"datesheet\", \"schedule\"\n📝 **Assignments** — \"assignments\", \"homework\"\n💰 **Finance** — \"fee status\", \"transactions\"\n📚 **Subjects** — \"subject analysis\", \"math\"\n📈 **Trends** — \"round comparison\", \"progress\"`;
    }

    // ── CMS Roll Number Lookup ──
    const cmsMatch = q.match(/cms[-\s]?(\d+)/i);
    if (cmsMatch) {
        const rollNum = cmsMatch[1];
        const found = REAL_STUDENTS.filter(s => s.roll.toLowerCase().includes(rollNum));
        if (found.length === 0) return `❌ No student found with roll number containing **"${rollNum}"**.`;
        return found.map(formatStudentCard).join('\n\n---\n\n');
    }

    // ── Result Card ──
    if (/result\s*card|report\s*card|marksheet|mark\s*sheet|datasheet|date\s*sheet/.test(qClean)) {
        let searchName = qClean.replace(/(result|card|report|marksheet|mark|sheet|datasheet|date|show|of|for|the|me|generate|print|get|display)/gi, '').trim();
        if (searchName.length >= 2) {
            const found = fuzzyFindStudents(searchName);
            if (found.length > 0) {
                return found.slice(0, 3).map(s => {
                    const g = getGrade(s.marks);
                    const subjStr = Object.entries(s.subjects).map(([sub, marks]) => {
                        const grade = getGrade(marks);
                        return `• ${sub}: **${marks}**/100 (${grade.grade})`;
                    }).join('\n');
                    return `📄 **RESULT CARD**\n\n━━━━━━━━━━━━━━━━━━━━━━━\n🏫 Country Model School\n━━━━━━━━━━━━━━━━━━━━━━━\n\n👩‍🎓 **Name**: ${s.name}\n📝 **Roll**: ${s.roll}\n🏫 **Class**: ${s.class}\n📅 **Attendance**: ${s.attendance}%\n\n**Subject-wise Marks:**\n${subjStr}\n\n━━━━━━━━━━━━━━━━━━━━━━━\n📊 **Total**: ${s.marks}% | **Grade**: ${g.grade}\n📋 **Status**: ${s.status}\n━━━━━━━━━━━━━━━━━━━━━━━`;
                }).join('\n\n---\n\n');
            }
        }
        return `📄 To generate a result card, type a student name after it.\n\nExample: *\"result card Qisa Fatima\"* or *\"result card CMS-696\"*`;
    }

    // ── Total students / overview / school ──
    if (/total\s*student|how many student|student count|overview|school\s*(stats|info|details|overview)|summary/.test(qClean)) {
        const classes = {};
        REAL_STUDENTS.forEach(s => { classes[s.class] = (classes[s.class] || 0) + 1; });
        const classBreak = Object.entries(classes).map(([c, n]) => `• **${c}**: ${n} students`).join('\n');
        const avg = (REAL_STUDENTS.reduce((a, s) => a + s.marks, 0) / REAL_STUDENTS.length).toFixed(1);
        const pass = REAL_STUDENTS.filter(s => s.marks >= 50).length;
        const passRate = ((pass / REAL_STUDENTS.length) * 100).toFixed(0);
        return `📊 **School Overview**\n\n**Total Students**: ${REAL_STUDENTS.length}\n**Overall Average**: ${avg}%\n**Pass Rate**: ${passRate}%\n**Faculty Members**: ${REAL_FACULTY.length}\n\n**Class Breakdown:**\n${classBreak}`;
    }

    // ── Top students / Topper ──
    if (/top\s*(\d+)|topper|best student|highest|position holder|leaderboard|rank/.test(qClean)) {
        const match = qClean.match(/top\s*(\d+)/);
        const count = match ? Math.min(parseInt(match[1]), 20) : 5;
        const sorted = [...REAL_STUDENTS].sort((a, b) => b.marks - a.marks).slice(0, count);
        const list = sorted.map((s, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
            return `${medal} **${s.name}** — ${s.marks}% (${s.class})`;
        }).join('\n');
        return `🏆 **Top ${count} Students (Round 5)**\n\n${list}`;
    }

    // ── Bottom / weakest students ──
    if (/bottom\s*(\d+)|weak|lowest|failing|fail|poor/.test(qClean)) {
        const match = qClean.match(/bottom\s*(\d+)/);
        const count = match ? Math.min(parseInt(match[1]), 20) : 5;
        const sorted = [...REAL_STUDENTS].filter(s => s.marks > 0).sort((a, b) => a.marks - b.marks).slice(0, count);
        const list = sorted.map((s, i) => `${i + 1}. **${s.name}** — ${s.marks}% (${s.class})`).join('\n');
        return `⚠️ **Bottom ${count} Students**\n\n${list}\n\nThese students need immediate academic intervention.`;
    }

    // ── At-risk students ──
    if (/at.?risk|risk|danger|critical|concern|struggling|need.?help/.test(qClean)) {
        const atRisk = Object.entries(ROUND_PERFORMANCE.students).filter(([, s]) => {
            const li = s.scores.length - 1;
            return s.scores[li] < 40 || (li > 0 && s.scores[li] < s.scores[li - 1] - 10);
        });
        if (atRisk.length === 0) return "✅ No students are currently flagged as at-risk.";
        const list = atRisk.slice(0, 10).map(([, s]) => {
            const li = s.scores.length - 1;
            const trend = li > 0 ? (s.scores[li] - s.scores[li - 1]).toFixed(1) : '0';
            return `• **${s.name}** (${s.class}) — ${s.scores[li]}% (${Number(trend) >= 0 ? '+' : ''}${trend}%)`;
        }).join('\n');
        return `🚨 **At-Risk Students** (${atRisk.length} detected)\n\n${list}${atRisk.length > 10 ? `\n\n...and ${atRisk.length - 10} more` : ''}`;
    }

    // ── Grade distribution ──
    if (/grade\s*(distribution|breakdown|chart|analysis)|grades|grading/.test(qClean)) {
        const grades = {};
        REAL_STUDENTS.forEach(s => {
            const g = getGrade(s.marks).grade;
            grades[g] = (grades[g] || 0) + 1;
        });
        const gradeList = Object.entries(grades).sort((a, b) => b[1] - a[1]).map(([g, c]) => {
            const pct = ((c / REAL_STUDENTS.length) * 100).toFixed(0);
            const bar = '█'.repeat(Math.round(c / 2));
            return `• **${g}**: ${c} students (${pct}%) ${bar}`;
        }).join('\n');
        return `📊 **Grade Distribution**\n\n${gradeList}\n\n**Total**: ${REAL_STUDENTS.length} students`;
    }

    // ── Timetable / Datesheet / Schedule ──
    if (/timetable|time\s*table|schedule|datesheet|period|class\s*timing/.test(qClean)) {
        const dayMatch = qClean.match(/(monday|tuesday|wednesday|thursday|friday|saturday)/i);
        if (dayMatch) {
            const day = dayMatch[1].charAt(0).toUpperCase() + dayMatch[1].slice(1).toLowerCase();
            const schedule = TIMETABLE.schedule[day];
            if (schedule) {
                const lines = TIMETABLE.periods.map((p, i) => `• **${p.time}** (${p.label}): ${schedule[i]}`).join('\n');
                return `📅 **${day} Timetable**\n\n${lines}`;
            }
        }
        const fullSchedule = TIMETABLE.days.map(day => {
            const subjects = TIMETABLE.schedule[day].filter(s => s !== '☕').join(', ');
            return `• **${day}**: ${subjects}`;
        }).join('\n');
        return `📅 **Weekly Timetable**\n\nPeriod Times: ${TIMETABLE.periods[0].time} to ${TIMETABLE.periods[TIMETABLE.periods.length - 1].time}\n\n${fullSchedule}\n\n💡 Type a day name for its full schedule, e.g., *\"Monday timetable\"*`;
    }

    // ── Assignments / Homework ──
    if (/assignment|homework|task|project|submission|due/.test(qClean)) {
        const list = ASSIGNMENTS.map(a => {
            const status = a.submissions >= a.total ? '✅' : a.submissions > a.total * 0.5 ? '⏳' : '🚨';
            return `${status} **${a.title}**\n   📚 ${a.course} (${a.class}) | 📅 Due: ${a.due}\n   📝 ${a.submissions}/${a.total} submitted | Priority: ${a.priority}`;
        }).join('\n\n');
        return `📝 **Active Assignments**\n\n${list}`;
    }

    // ── Transactions ──
    if (/transaction|recent\s*payment|payment\s*history|billing/.test(qClean)) {
        const list = TRANSACTIONS.map(t => {
            const icon = t.status === 'Completed' ? '✅' : '⏳';
            return `${icon} **${t.id}** — ${t.student}\n   ${t.type} | PKR ${t.amount.toLocaleString()} | ${t.method} | ${t.date}`;
        }).join('\n\n');
        return `💳 **Recent Transactions**\n\n${list}`;
    }

    // ── Specific class stats ──
    const classMatch = qClean.match(/(9th\s*rose|9th\s*jasmine|10th\s*rose|10th\s*jasmine)/i);
    if (classMatch) {
        const className = classMatch[1].replace(/(\d+)(th)/i, '$1$2').replace(/\s+/g, ' ');
        const normClass = className.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        const students = REAL_STUDENTS.filter(s => s.class.toLowerCase() === normClass.toLowerCase());
        if (students.length === 0) return `No students found in class "${normClass}".`;

        // Check if they want the class list
        if (/list|all|student|who|names|roll/.test(qClean)) {
            const sorted = [...students].sort((a, b) => b.marks - a.marks);
            const list = sorted.map((s, i) => `${i + 1}. **${s.name}** (${s.roll}) — ${s.marks}%`).join('\n');
            return `📋 **${normClass} — Student List** (${students.length} students)\n\n${list}`;
        }

        const avg = (students.reduce((a, s) => a + s.marks, 0) / students.length).toFixed(1);
        const top = [...students].sort((a, b) => b.marks - a.marks)[0];
        const pass = students.filter(s => s.marks >= 50).length;
        const passRate = ((pass / students.length) * 100).toFixed(0);
        const atRisk = students.filter(s => s.marks < 40).length;

        const roundData = CLASS_ROUND_PERFORMANCE.map(r => `• ${r.round}: ${r[normClass] || 'N/A'}%`).join('\n');

        return `📋 **${normClass} — Class Report**\n\n👥 **Students**: ${students.length}\n📊 **Class Average**: ${avg}%\n✅ **Pass Rate** (≥50%): ${passRate}%\n🏆 **Topper**: ${top.name} (${top.marks}%)\n⚠️ **At-Risk** (<40%): ${atRisk} students\n\n**Round-wise Class Average:**\n${roundData}\n\n💡 Type *\"${normClass} list\"* to see all students.`;
    }

    // ── Explicit student lookup ──
    if (/student|tell me about|who is|marks of|score of|result of|search|find|look\s*up|info|details/.test(qClean)) {
        let searchName = qClean.replace(/(student|tell me about|who is|marks of|score of|result of|what is|the|show|find|search|details|info|about|look\s*up|for|me|display|get)/gi, '').trim();
        if (searchName.length >= 2) {
            const found = fuzzyFindStudents(searchName);
            if (found.length > 0) {
                if (found.length > 5) {
                    const list = found.slice(0, 10).map(s => `• **${s.name}** — ${s.marks}% (${s.class})`).join('\n');
                    return `Found **${found.length}** matches:\n\n${list}${found.length > 10 ? '\n\n... type a more specific name for details.' : ''}`;
                }
                return found.map(formatStudentCard).join('\n\n---\n\n');
            }
            // Try teachers too
            const { faculty, teachers } = fuzzyFindTeachers(searchName);
            if (teachers.length > 0) {
                return teachers.map(t => {
                    const classStr = Object.entries(t.classAvg).map(([cls, avg]) => `• ${cls}: ${avg}%`).join('\n');
                    return `${t.img} **${t.name}** — ${t.subject}\n\n✅ Pass Rate: **${t.passRate}%**\n📊 Avg Class Score: **${t.avgClassScore}%**\n⭐ Student Satisfaction: ${t.studentSatisfaction}%\n📝 Assignments: ${t.assignmentsGraded}/${t.totalAssignments} graded\n📅 Classes/Week: ${t.classesPerWeek}\n🎓 Experience: ${t.yearsExperience} years\n\n**Class-wise Performance:**\n${classStr}\n\n**Strengths:** ${t.strengths.join(', ')}`;
                }).join('\n\n---\n\n');
            }
            if (faculty.length > 0) {
                return faculty.map(f => `${f.img} **${f.name}**\n\n📚 Subject: ${f.subject}\n🏷 Role: ${f.role}\n🏫 Classes: ${f.classes}\n⭐ Rating: ${f.rating}/100\n📧 Email: ${f.email}\n📋 Status: ${f.status}`).join('\n\n');
            }
            return `❌ No student or teacher found matching **"${searchName}"**. Try a different name.`;
        }
    }

    // ── Faculty / Teacher lookup ──
    if (/faculty|teacher|sir|ms\.|madam|professor|staff/.test(qClean)) {
        const teacherName = qClean.replace(/(faculty|teacher|tell me about|who is|the|show|info|details|about|list|all|staff|review|performance|rating)/gi, '').trim();

        if (teacherName.length < 2 || /^(all|every|list)$/.test(teacherName)) {
            const list = REAL_FACULTY.map(f => `${f.img} **${f.name}** — ${f.subject} (${f.role}) ${f.status === 'On Leave' ? '🔴 On Leave' : '🟢 Active'}`).join('\n');
            return `👩‍🏫 **Faculty Members** (${REAL_FACULTY.length})\n\n${list}\n\n💡 Type a teacher name for detailed performance review.`;
        }

        const { faculty, teachers } = fuzzyFindTeachers(teacherName);
        if (teachers.length > 0) {
            return teachers.map(t => {
                const classStr = Object.entries(t.classAvg).map(([cls, avg]) => `• ${cls}: ${avg}%`).join('\n');
                return `${t.img} **${t.name}** — ${t.subject}\n\n✅ Pass Rate: **${t.passRate}%**\n📊 Avg Class Score: **${t.avgClassScore}%**\n⭐ Student Satisfaction: ${t.studentSatisfaction}%\n📝 Assignments: ${t.assignmentsGraded}/${t.totalAssignments} graded\n📅 Classes/Week: ${t.classesPerWeek}\n🎓 Experience: ${t.yearsExperience} years\n\n**Class-wise Performance:**\n${classStr}\n\n**Strengths:** ${t.strengths.join(', ')}`;
            }).join('\n\n---\n\n');
        }
        if (faculty.length > 0) {
            return faculty.map(f => `${f.img} **${f.name}**\n\n📚 Subject: ${f.subject}\n🏷 Role: ${f.role}\n🏫 Classes: ${f.classes}\n⭐ Rating: ${f.rating}/100\n📧 Email: ${f.email}\n📋 Status: ${f.status}`).join('\n\n');
        }
        return `No teacher found matching **"${teacherName}"**.`;
    }

    // ── Pass rate ──
    if (/pass\s*rate|passing|pass\s*percentage/.test(qClean)) {
        const classes = ['9th Rose', '9th Jasmine', '10th Rose', '10th Jasmine'];
        const results = classes.map(cls => {
            const students = REAL_STUDENTS.filter(s => s.class === cls);
            const pass = students.filter(s => s.marks >= 50).length;
            const rate = ((pass / students.length) * 100).toFixed(0);
            return `• **${cls}**: ${rate}% (${pass}/${students.length} passed)`;
        }).join('\n');
        const totalPass = REAL_STUDENTS.filter(s => s.marks >= 50).length;
        const totalRate = ((totalPass / REAL_STUDENTS.length) * 100).toFixed(0);
        return `📊 **Pass Rate Analysis** (≥50%)\n\n**Overall**: ${totalRate}% (${totalPass}/${REAL_STUDENTS.length})\n\n**By Class:**\n${results}`;
    }

    // ── Average ──
    if (/average|avg|mean/.test(qClean)) {
        const classes = ['9th Rose', '9th Jasmine', '10th Rose', '10th Jasmine'];
        const results = classes.map(cls => {
            const students = REAL_STUDENTS.filter(s => s.class === cls);
            const avg = (students.reduce((a, s) => a + s.marks, 0) / students.length).toFixed(1);
            return `• **${cls}**: ${avg}%`;
        }).join('\n');
        const totalAvg = (REAL_STUDENTS.reduce((a, s) => a + s.marks, 0) / REAL_STUDENTS.length).toFixed(1);
        return `📊 **Average Marks**\n\n**Overall Average**: ${totalAvg}%\n\n**By Class:**\n${results}`;
    }

    // ── Round performance / comparison ──
    if (/round|comparison|compare|trend|progress/.test(qClean)) {
        const lines = CLASS_ROUND_PERFORMANCE.map(r => {
            const vals = ['9th Rose', '9th Jasmine', '10th Rose', '10th Jasmine'].map(c => `${c}: ${r[c]}%`).join(' | ');
            return `**${r.round}**: ${vals}`;
        }).join('\n');
        return `📈 **Round-wise Class Performance**\n\n${lines}\n\n💡 *Navigate to Student Performance tab for detailed charts.*`;
    }

    // ── Attendance ──
    if (/attendance/.test(qClean)) {
        const classes = ['9th Rose', '9th Jasmine', '10th Rose', '10th Jasmine'];
        const results = classes.map(cls => {
            const students = REAL_STUDENTS.filter(s => s.class === cls);
            const avg = (students.reduce((a, s) => a + s.attendance, 0) / students.length).toFixed(0);
            return `• **${cls}**: ${avg}%`;
        }).join('\n');
        const totalAvg = (REAL_STUDENTS.reduce((a, s) => a + s.attendance, 0) / REAL_STUDENTS.length).toFixed(0);
        return `📅 **Attendance Report**\n\n**Overall Average**: ${totalAvg}%\n\n**By Class:**\n${results}`;
    }

    // ── Fee status ──
    if (/fee|payment|finance|due|overdue|pending/.test(qClean)) {
        const paid = REAL_STUDENTS.filter(s => s.fee === 'Paid').length;
        const pending = REAL_STUDENTS.filter(s => s.fee === 'Pending').length;
        const overdue = REAL_STUDENTS.filter(s => s.fee === 'Overdue').length;
        return `💰 **Fee Status Overview**\n\n✅ **Paid**: ${paid} students (${((paid / REAL_STUDENTS.length) * 100).toFixed(0)}%)\n⏳ **Pending**: ${pending} students (${((pending / REAL_STUDENTS.length) * 100).toFixed(0)}%)\n🚨 **Overdue**: ${overdue} students (${((overdue / REAL_STUDENTS.length) * 100).toFixed(0)}%)\n\n💡 Type *\"transactions\"* to see recent payment history.`;
    }

    // ── Subject-wise analysis ──
    if (/subject|math|english|physics|chemistry|biology|urdu|eng|phy|chem|bio|science/.test(qClean)) {
        const subjects = ['Math', 'Eng', 'Phy', 'Bio', 'Urdu', 'Chem'];
        const avgBySubject = subjects.map(sub => {
            const vals = REAL_STUDENTS.map(s => s.subjects[sub] || 0).filter(v => v > 0);
            const avg = vals.length > 0 ? (vals.reduce((a, v) => a + v, 0) / vals.length).toFixed(1) : 'N/A';
            const highest = Math.max(...vals);
            const lowest = Math.min(...vals);
            return `• **${sub}**: Avg ${avg}% (High: ${highest}, Low: ${lowest})`;
        }).join('\n');
        return `📚 **Subject-wise Analysis (All Students)**\n\n${avgBySubject}`;
    }

    // ── Thank you / bye ──
    if (/thank|thanks|bye|goodbye|good bye|see you|tata/.test(qClean)) {
        return `You're welcome! 😊 Feel free to ask me anything anytime. I'm always here to help with school data! 🎓`;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ── SMART FALLBACK: Try to match against student/teacher names ────
    // ═══════════════════════════════════════════════════════════════════

    // Try matching as a student name first
    const studentMatches = fuzzyFindStudents(qClean);
    if (studentMatches.length > 0) {
        if (studentMatches.length > 5) {
            const list = studentMatches.slice(0, 10).map(s => `• **${s.name}** — ${s.marks}% (${s.class})`).join('\n');
            return `Found **${studentMatches.length}** students matching your search:\n\n${list}${studentMatches.length > 10 ? '\n\n... type a more specific name.' : ''}`;
        }
        return studentMatches.map(formatStudentCard).join('\n\n---\n\n');
    }

    // Try matching as a teacher name
    const { faculty, teachers } = fuzzyFindTeachers(qClean);
    if (teachers.length > 0) {
        return teachers.map(t => {
            const classStr = Object.entries(t.classAvg).map(([cls, avg]) => `• ${cls}: ${avg}%`).join('\n');
            return `${t.img} **${t.name}** — ${t.subject}\n\n✅ Pass Rate: **${t.passRate}%**\n📊 Avg Class Score: **${t.avgClassScore}%**\n⭐ Student Satisfaction: ${t.studentSatisfaction}%\n📝 Assignments: ${t.assignmentsGraded}/${t.totalAssignments} graded\n📅 Classes/Week: ${t.classesPerWeek}\n🎓 Experience: ${t.yearsExperience} years\n\n**Class-wise Performance:**\n${classStr}\n\n**Strengths:** ${t.strengths.join(', ')}`;
        }).join('\n\n---\n\n');
    }
    if (faculty.length > 0) {
        return faculty.map(f => `${f.img} **${f.name}**\n\n📚 Subject: ${f.subject}\n🏷 Role: ${f.role}\n🏫 Classes: ${f.classes}\n⭐ Rating: ${f.rating}/100\n📧 Email: ${f.email}\n📋 Status: ${f.status}`).join('\n\n');
    }

    // ── Final fallback: Try single word against all student names with partial match ──
    const words = qClean.split(/\s+/).filter(w => w.length >= 3);
    for (const word of words) {
        const partialMatches = REAL_STUDENTS.filter(s => s.name.toLowerCase().includes(word));
        if (partialMatches.length > 0 && partialMatches.length <= 10) {
            const list = partialMatches.map(s => `• **${s.name}** — ${s.marks}% (${s.class})`).join('\n');
            return `I found **${partialMatches.length}** student(s) matching **"${word}"**:\n\n${list}\n\n💡 Click or type the full name for detailed info.`;
        }
    }

    // True fallback — give helpful guidance
    return `🤔 I couldn't find anything matching **"${input}"**.\n\nTry:\n• Type a **student name** (e.g., Qisa, Fatima)\n• Type a **roll number** (e.g., CMS-696)\n• Type a **class name** (e.g., 9th Rose)\n• Type a **teacher name** (e.g., Sir Kamran)\n• Or ask about: **topper**, **average**, **timetable**, **grades**, **assignments**`;
};

// ─── Simple Markdown Renderer ────────────────────────────────────────
const renderMarkdown = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
        // Bold
        let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic
        processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

        if (processed.startsWith('• ') || processed.startsWith('- ')) {
            return <div key={i} className="pl-3 py-0.5" dangerouslySetInnerHTML={{ __html: '&bull; ' + processed.slice(2) }} />;
        }
        if (/^\d+\.\s/.test(processed)) {
            return <div key={i} className="pl-3 py-0.5" dangerouslySetInnerHTML={{ __html: processed }} />;
        }
        if (processed === '---') {
            return <hr key={i} className="my-2 border-slate-200 dark:border-slate-600" />;
        }
        if (processed.trim() === '') {
            return <div key={i} className="h-1.5" />;
        }
        return <div key={i} className="py-0.5" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
};

// ─── ChatBot Component ───────────────────────────────────────────────
const ChatBot = ({ darkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: `Welcome to **CMS Assistant**! 🎓\n\nI have access to all school data — **${REAL_STUDENTS.length} students**, **${REAL_FACULTY.length} faculty**, and performance data across **4 classes** and **4 rounds**.\n\n🎤 **Voice enabled!** Click the mic button to speak your query.\n\nAsk me anything about students, classes, teachers, or performance!` },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    // ── Strip markdown for speech ──
    const stripMarkdown = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/[•━═─]/g, '')
            .replace(/\n+/g, '. ')
            .replace(/[🎓👩‍🎓🏫📊📝📋📅💰✅⏳🚨🏆⚠️📈📚👩‍🏫🥇🥈🥉💡🤔❌📄💳🔴🟢⭐🎤👋😊]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // ── Voice Output ──
    const speakResponse = (text) => {
        if (!voiceEnabled) return;
        window.speechSynthesis.cancel();
        const clean = stripMarkdown(text);
        // Limit to first 300 chars for long responses
        const truncated = clean.length > 300 ? clean.slice(0, 300) + '. And more details available in chat.' : clean;
        const utterance = new SpeechSynthesisUtterance(truncated);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    // ── Voice Input ──
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setMessages(prev => [...prev, { role: 'bot', text: '❌ **Voice not supported** in this browser. Please use Chrome or Edge.' }]);
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setIsListening(false);
            // Send as a message
            setMessages(prev => [...prev, { role: 'user', text: `🎤 ${transcript}` }]);
            setIsTyping(true);
            setTimeout(() => {
                const response = queryEngine(transcript);
                setMessages(prev => [...prev, { role: 'bot', text: response }]);
                setIsTyping(false);
                speakResponse(response);
            }, 400 + Math.random() * 600);
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            if (event.error === 'no-speech') {
                setMessages(prev => [...prev, { role: 'bot', text: '🎤 I didn\'t hear anything. Please try speaking again.' }]);
            }
        };

        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);

        setTimeout(() => {
            const response = queryEngine(userMsg);
            setMessages(prev => [...prev, { role: 'bot', text: response }]);
            setIsTyping(false);
        }, 400 + Math.random() * 600);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestions = [
        "School overview",
        "Who is the topper?",
        "9th Rose stats",
        "At-risk students",
        "Pass rate",
        "Teacher Sir Kamran",
    ];

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen
                    ? 'bg-slate-700 rotate-90'
                    : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 animate-bounce-subtle'
                    }`}
                style={{ animationDuration: '3s' }}
            >
                {isOpen ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div
                    className={`fixed bottom-24 right-6 z-[99] w-[400px] max-w-[calc(100vw-2rem)] rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 animate-slide-up flex flex-col ${darkMode
                        ? 'bg-slate-900/95 border-slate-700/50 backdrop-blur-xl'
                        : 'bg-white/95 border-slate-200/50 backdrop-blur-xl'
                        }`}
                    style={{ height: 'min(550px, calc(100vh - 140px))' }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 flex items-center gap-3 shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-sm">CMS Assistant</h3>
                            <p className="text-indigo-200 text-xs flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-400' : isSpeaking ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></span>
                                {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : 'Online — Voice Enabled'}
                            </p>
                        </div>
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => { setVoiceEnabled(!voiceEnabled); if (!voiceEnabled === false) window.speechSynthesis.cancel(); }}
                                className={`p-1.5 rounded-lg transition-all ${voiceEnabled ? 'bg-white/20 text-white' : 'bg-white/10 text-indigo-300'}`}
                                title={voiceEnabled ? 'Mute voice replies' : 'Enable voice replies'}
                            >
                                {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                            </button>
                            <Sparkles size={16} className="text-indigo-200 mt-1.5" />
                        </div>
                    </div>

                    {/* Messages */}
                    <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 ${darkMode ? 'scrollbar-dark' : ''}`}>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user'
                                    ? 'bg-indigo-100 text-indigo-600'
                                    : darkMode ? 'bg-slate-700 text-purple-400' : 'bg-purple-100 text-purple-600'
                                    }`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-md'
                                    : darkMode
                                        ? 'bg-slate-800 text-slate-200 rounded-tl-md border border-slate-700'
                                        : 'bg-slate-100 text-slate-700 rounded-tl-md border border-slate-200'
                                    }`}>
                                    {renderMarkdown(msg.text)}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${darkMode ? 'bg-slate-700 text-purple-400' : 'bg-purple-100 text-purple-600'
                                    }`}>
                                    <Bot size={14} />
                                </div>
                                <div className={`rounded-2xl px-4 py-3 rounded-tl-md ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200'
                                    }`}>
                                    <div className="flex gap-1.5 items-center h-4">
                                        <span className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-slate-500' : 'bg-slate-400'}`} style={{ animationDelay: '0ms' }}></span>
                                        <span className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-slate-500' : 'bg-slate-400'}`} style={{ animationDelay: '150ms' }}></span>
                                        <span className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-slate-500' : 'bg-slate-400'}`} style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions (only show when few messages) */}
                    {messages.length <= 2 && (
                        <div className={`px-4 pb-2 shrink-0 ${darkMode ? 'border-t border-slate-800' : 'border-t border-slate-100'}`}>
                            <p className={`text-[10px] uppercase font-bold mt-2 mb-1.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Quick Questions</p>
                            <div className="flex flex-wrap gap-1.5">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setMessages(prev => [...prev, { role: 'user', text: s }]);
                                            setIsTyping(true);
                                            setTimeout(() => {
                                                setMessages(prev => [...prev, { role: 'bot', text: queryEngine(s) }]);
                                                setIsTyping(false);
                                            }, 400 + Math.random() * 600);
                                        }}
                                        className={`text-[11px] px-3 py-1.5 rounded-xl font-medium transition-all hover:scale-105 ${darkMode
                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className={`px-4 py-3 shrink-0 ${darkMode ? 'border-t border-slate-800' : 'border-t border-slate-100'}`}>
                        <div className={`flex items-center gap-2 rounded-xl px-4 py-2 ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-200'
                            } ${isListening ? 'ring-2 ring-red-400 ring-opacity-60' : ''}`}>
                            <button
                                onClick={startListening}
                                className={`p-2 rounded-lg transition-all shrink-0 ${isListening
                                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-300/50'
                                    : darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}
                                title={isListening ? 'Stop listening' : 'Voice command'}
                            >
                                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={isListening ? '🎤 Listening... speak now' : 'Type or speak your query...'}
                                className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'
                                    }`}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className={`p-2 rounded-lg transition-all ${input.trim()
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-300/30'
                                    : darkMode ? 'text-slate-600' : 'text-slate-300'
                                    }`}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <p className={`text-[10px] text-center mt-2 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                            🎤 Voice Agent • CMS Real Data Engine • {REAL_STUDENTS.length} Students
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
