'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface AttendanceRecord {
  id: string;
  scanned_at: string;
  profiles: {
    id: string;
    full_name: string;
    nim: string | null;
  } | null;
}

interface AttendanceListProps {
  sessionId: string;
  initialAttendance: AttendanceRecord[];
}

export function AttendanceList({ sessionId, initialAttendance }: AttendanceListProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to realtime changes
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
          // Fetch the new attendance record with profile data
          const { data } = await supabase
            .from('attendance')
            .select(`
              id,
              scanned_at,
              profiles:student_id (
                id,
                full_name,
                nim
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setAttendance((prev) => [data as AttendanceRecord, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [sessionId, supabase]);

  if (attendance.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Belum ada mahasiswa yang hadir
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          Daftar Kehadiran ({attendance.length} mahasiswa)
        </h3>
        <Badge variant="outline" className="animate-pulse">
          Real-time
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>NIM</TableHead>
            <TableHead>Waktu Scan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record, index) => (
            <TableRow key={record.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">
                {record.profiles?.full_name || '-'}
              </TableCell>
              <TableCell>{record.profiles?.nim || '-'}</TableCell>
              <TableCell>
                {new Date(record.scanned_at).toLocaleString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
