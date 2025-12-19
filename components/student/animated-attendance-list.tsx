'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { StaggerChildren } from '@/components/animated/stagger-container';
import { slideUp } from '@/lib/animations';

interface AttendanceRecord {
  id: string;
  scanned_at: string;
  sessions: {
    id: string;
    course_name: string;
    created_at: string;
  } | null;
}

interface AnimatedAttendanceListProps {
  attendance: AttendanceRecord[];
}

export function AnimatedAttendanceList({ attendance }: AnimatedAttendanceListProps) {
  return (
    <StaggerChildren fast className="space-y-4">
      {attendance.map((record) => (
        <motion.div key={record.id} variants={slideUp}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    {record.sessions?.course_name || 'Unknown Course'}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Hadir
                </Badge>
              </div>
              <CardDescription>
                {new Date(record.scanned_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Waktu absen:{' '}
                {new Date(record.scanned_at).toLocaleTimeString('id-ID')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </StaggerChildren>
  );
}
