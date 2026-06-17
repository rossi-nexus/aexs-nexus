DROP POLICY IF EXISTS "Read actor_capacity_attributes" ON public.actor_capacity_attributes;

CREATE POLICY "Read actor_capacity_attributes"
ON public.actor_capacity_attributes
FOR SELECT
USING (
  is_admin(auth.uid())
  OR fn_user_has_attr(auth.uid(), 'actors:visibility', 'all')
  OR EXISTS (
    SELECT 1
    FROM actors a
    JOIN actor_ontology_tags t ON t.actor_id = a.id
    WHERE t.id = actor_capacity_attributes.actor_ontology_tag_id
      AND a.verification_status = 'verified'
  )
);