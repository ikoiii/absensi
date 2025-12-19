'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, User } from 'lucide-react';
import { AttendanceListSkeleton } from '@/components/ui/skeletons';
import { EmptyState } from '@/components/ui/states';

interface AttendanceWithProfile {
  id: string;
  student_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    nim: string;
    email: string;
  } | null;
}

export function AttendanceList({
  sessionId,
  initialAttendance,
}: {
  sessionId: string;
  initialAttendance: AttendanceWithProfile[];
}) {
  const [attendance, setAttendance] = useState<AttendanceWithProfile[]>(
    initialAttendance
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to new attendance records
    const channel = supabase
      .channel(`attendance-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'attendance',
          filter: `session_id=eq.${sessionId}`,
        },
        async (payload) => {
          // Fetch the profile data for the new attendance
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, nim, email')
            .eq('id', payload.new.student_id)
            .single();

          const newAttendance: AttendanceWithProfile = {
            id: payload.new.id,
            student_id: payload.new.student_id,
            created_at: payload.new.created_at,
            profiles: profile,
          };

          setAttendance((prev) => [newAttendance, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  if (isLoading) {
    return <AttendanceListSkeleton count={5} />;
  }

  if (attendance.length === 0) {
    return (
      <EmptyState
        title="Belum Ada Kehadiran"
        description="Belum ada mahasiswa yang melakukan absensi untuk sesi ini. Kehadiran akan muncul di sini secara real-time."
      />
    );
  }

  return (
    <div className="space-y-3">
      {attendance.map((record) => (
        <div
          key={record.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {record.profiles?.full_name || 'Unknown'}
              </p>
              <p className="text-sm text-muted-foreground">
                {record.profiles?.nim || 'No NIM'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">
                {new Date(record.created_at).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(record.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Hadir
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
