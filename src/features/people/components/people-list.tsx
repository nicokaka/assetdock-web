import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PersonSummary } from '@/features/people/types/person'

type PeopleListProps = {
  people: PersonSummary[]
}

export const PeopleList = React.memo(function PeopleList({ people }: PeopleListProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('personForm.labels.status', 'Status')}</TableHead>
          <TableHead>{t('personForm.labels.fullName', 'Name')}</TableHead>
          <TableHead>{t('personForm.labels.email', 'Email')}</TableHead>
          <TableHead>{t('personForm.labels.department', 'Department')}</TableHead>
          <TableHead className="text-right">{t('app.assets.table.actions', 'Actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {people.map((person) => (
          <TableRow key={person.id}>
            <TableCell>
              <Badge variant={person.active ? 'success' : 'muted'}>
                {person.active ? t('personForm.status.active', 'Active') : t('personForm.status.inactive', 'Inactive')}
              </Badge>
            </TableCell>
            <TableCell>
              <Link
                to={`/app/people/${person.id}`}
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                {person.fullName}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {person.email || t('common.na', 'N/A')}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {person.department || t('common.na', 'N/A')}
            </TableCell>
            <TableCell className="text-right">
              <Link
                to={`/app/people/${person.id}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t('app.assets.table.view', 'View')}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})
