import { Job } from '../types';

interface JobSelectProps {
  jobs: Job[];
  value: string;
  onChange: (jobId: string) => void;
  label?: string;
}

export function JobSelect({ jobs, value, onChange, label = '岗位选择' }: JobSelectProps) {
  return (
    <label className="block">
      <span className="label mb-2 block">{label}</span>
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </select>
    </label>
  );
}
